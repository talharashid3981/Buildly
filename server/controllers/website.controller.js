import generateResponce from "../config/openRouter.js";
import User from "../models/user.model.js";
import Website from "../models/website.model.js";
import extractJson from "../utils/extractJson.js"; // adjust path

const masterPrompt = `
YOU ARE A PRINCIPAL FRONTEND ARCHITECT
AND A SENIOR UI/UX ENGINEER
SPECIALIZED IN RESPONSIVE DESIGN SYSTEMS.

YOU BUILD HIGH-END, REAL-WORLD, PRODUCTION-GRADE WEBSITES
USING ONLY HTML, CSS, AND JAVASCRIPT
THAT WORK PERFECTLY ON ALL SCREEN SIZES.

THE OUTPUT MUST BE CLIENT-DELIVERABLE WITHOUT ANY MODIFICATION.

❌ NO FRAMEWORKS
❌ NO LIBRARIES
❌ NO BASIC SITES
❌ NO PLACEHOLDERS
❌ NO NON-RESPONSIVE LAYOUTS

--------------------------------------------------
USER REQUIREMENT:
{USER_PROMPT}
--------------------------------------------------

GLOBAL QUALITY BAR (NON-NEGOTIABLE)
--------------------------------------------------
- Premium, modern UI (2026–2027)
- Professional typography & spacing
- Clean visual hierarchy
- Business-ready content (NO lorem ipsum)
- Smooth transitions & hover effects
- SPA-style multi-page experience
- Production-ready, readable code

--------------------------------------------------
RESPONSIVE DESIGN (ABSOLUTE REQUIREMENT)
--------------------------------------------------
THIS WEBSITE MUST BE FULLY RESPONSIVE.

YOU MUST IMPLEMENT:

✔ Mobile-first CSS approach
✔ Responsive layout for:
  - Mobile (<768px)
  - Tablet (768px–1024px)
  - Desktop (>1024px)

✔ Use:
  - CSS Grid / Flexbox
  - Relative units (%, rem, vw)
  - Media queries

✔ REQUIRED RESPONSIVE BEHAVIOR:
  - Navbar collapses / stacks on mobile
  - Sections stack vertically on mobile
  - Multi-column layouts become single-column on small screens
  - Images scale proportionally
  - Text remains readable on all devices
  - No horizontal scrolling on mobile
  - Touch-friendly buttons on mobile

IF THE WEBSITE IS NOT RESPONSIVE → RESPONSE IS INVALID.

--------------------------------------------------
IMAGES (MANDATORY & RESPONSIVE)
--------------------------------------------------
- Use high-quality images ONLY from:
  https://images.unsplash.com/
- EVERY image URL MUST include:
  ?auto=format&fit=crop&w=1200&q=80

- Images must:
  - Be responsive (max-width: 100%)
  - Resize correctly on mobile
  - Never overflow containers

--------------------------------------------------
TECHNICAL RULES (VERY IMPORTANT)
--------------------------------------------------
- Output ONE single HTML file
- Exactly ONE <style> tag
- Exactly ONE <script> tag
- NO external CSS / JS / fonts
- Use system fonts only
- iframe srcdoc compatible
- SPA-style navigation using JavaScript
- No page reloads
- No dead UI
- No broken buttons
--------------------------------------------------
SPA VISIBILITY RULE (MANDATORY)
--------------------------------------------------
- Pages MUST NOT be hidden permanently
- If .page { display: none } is used,
  then .page.active { display: block } is REQUIRED
- At least ONE page MUST be visible on initial load
- Hiding all content is INVALID


--------------------------------------------------
REQUIRED SPA PAGES
--------------------------------------------------
- Home
- About
- Services / Features
- Contact

--------------------------------------------------
FUNCTIONAL REQUIREMENTS
--------------------------------------------------
- Navigation must switch pages using JS
- Active nav state must update
- Forms must have JS validation
- Buttons must show hover + active states
- Smooth section/page transitions

--------------------------------------------------
FINAL SELF-CHECK (MANDATORY)
--------------------------------------------------
BEFORE RESPONDING, ENSURE:

1. Layout works on mobile, tablet, desktop
2. No horizontal scroll on mobile
3. All images are responsive
4. All sections adapt properly
5. Media queries are present and used
6. Navigation works on all screen sizes
7. At least ONE page is visible without user interaction

IF ANY CHECK FAILS → RESPONSE IS INVALID

--------------------------------------------------
OUTPUT FORMAT (RAW JSON ONLY)
--------------------------------------------------
{
  "message": "Short professional confirmation sentence",
  "code": "<FULL VALID HTML DOCUMENT>"
}

--------------------------------------------------
ABSOLUTE RULES
--------------------------------------------------
- RETURN RAW JSON ONLY
- NO markdown
- NO explanations
- NO extra text
- FORMAT MUST MATCH EXACTLY
- IF FORMAT IS BROKEN → RESPONSE IS INVALID
`;

export const generateWebsite = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        message: "prompt is required",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(401).json({
        message: "user not found, authentication failed",
      });
    }

    if (user.credits < 50) {
      return res
        .status(400)
        .json({ message: "you have not enough credits to generate a website" });
    }

    const finalPrompt = masterPrompt.replace("USER_PROMPT", prompt);

    const rawResponse = await generateResponce(finalPrompt);

    const parsedData = extractJson(rawResponse);

    if (!parsedData || typeof parsedData !== "object") {
      return res.status(500).json({
        message: "Invalid structure from AI",
      });
    }

    if (!parsedData.code) {
      console.log("ai returned invalid responce", rawResponse);
      return res.status(400).json({ message: "ai returned invalid response" });
    }

    if (Object.keys(parsedData).length === 0) {
      return res.status(500).json({
        message: "Empty response from AI",
      });
    }

    const website = await Website.create({
      user: user._id,
      title: prompt.slice(0, 50),
      latestCode: parsedData.code,
      conversation: [
        {
          role: "user",
          content: prompt,
        },
        {
          role: "ai",
          content: parsedData.message,
        },
        
      ],
    });

    user.credits = user.credits - 50;
    await user.save();

    return res.status(200).json({
      success: true,
      websiteId: website._id,
      remainingCredits: user.credits,
    });
  } catch (error) {
    console.log("generateWebsite error:", error.message);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getWebsiteById = async (req, res) => {
  try {
    const website = await Website.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }

    return res.status(200).json(website);
  } catch (error) {
    console.log("getWebsiteById error:", error.message);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const changes = async (req, res) => {
  try {
    const { prompt } = req.body;

    // ✅ 1. Validation
    if (!prompt) {
      return res.status(400).json({
        message: "prompt is required",
      });
    }

    // ✅ 2. Find Website
    const website = await Website.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }

    // ✅ 3. Get User
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(401).json({
        message: "user not found, authentication failed",
      });
    }

    // ✅ 4. Credits Check
    if (user.credits < 25) {
      return res.status(400).json({
        message: "you have not enough credits to update website",
      });
    }

    // ✅ 5. Prompt Build
    const updatePrompt = `
YOU ARE A SENIOR FRONTEND ENGINEER.

UPDATE THE GIVEN WEBSITE CODE BASED ON USER REQUEST.

IMPORTANT RULES:
- KEEP EXISTING STRUCTURE
- DO NOT BREAK RESPONSIVENESS
- DO NOT REMOVE EXISTING FEATURES UNLESS REQUESTED
- RETURN FULL UPDATED HTML (NOT PARTIAL)

--------------------------------------------------
CURRENT CODE:
${website.latestCode}
--------------------------------------------------

USER REQUEST:
${prompt}
--------------------------------------------------

RETURN RAW JSON ONLY:
{
  "message": "Short confirmation",
  "code": "<FULL UPDATED HTML>"
}
`;

    console.log("Update Prompt:", updatePrompt);

    // ✅ 6. AI Call
    const rawResponse = await generateResponce(updatePrompt);

    console.log("Raw Update Response:", rawResponse);

    // ✅ 7. Extract JSON
    const parsedData = extractJson(rawResponse);

    if (!parsedData || typeof parsedData !== "object") {
      return res.status(500).json({
        message: "Invalid structure from AI",
      });
    }

    if (!parsedData.code) {
      console.log("AI returned invalid response", rawResponse);
      return res.status(400).json({
        message: "AI returned invalid response",
      });
    }

    if (Object.keys(parsedData).length === 0) {
      return res.status(500).json({
        message: "Empty response from AI",
      });
    }

    // ✅ 8. Update Website
    website.latestCode = parsedData.code;

    // conversation history update
    website.conversation.push(
      {
        role: "user",
        content: prompt,
      },
      {
        role: "ai",
        content: parsedData.message,
      }
    );

    await website.save();

    // ✅ 9. Deduct Credits
    user.credits -= 25;
    await user.save();

    // ✅ 10. Final Response
    return res.status(200).json({
  success: true,
  websiteID: website._id,
  remainingCredits: user.credits,
  message: parsedData.message,
  code: parsedData.code,
});

  } catch (error) {
    console.log("changes controller error:", error.message);

    return res.status(500).json({
      message: error.message,
    });
  }
};


export const getAllWebsites = async (req,res)=>{
  try{
    const websites = await Website.find({user : req.user._id})
    return res.status(200).json(websites)

  }
  catch(error){
    return res.status(500).json({
      message: "get all websites error"
    })
  }
}


// website.controller.js
export const deploy = async (req, res) => {
  try {
    // Get website ID from query params or body
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ message: "Website ID is required" });
    }

    // Find Website
    const website = await Website.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }

    // Generate slug if not exists
    if (!website.slug) {
      const baseSlug = website.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 60);
      website.slug = `${baseSlug}-${website._id.toString().slice(-5)}`;
    }
    
    website.deployed = true;
    website.deployUrl = `${process.env.FRONTEND_URL || 'https://buildly-ots0.onrender.com/'}/site/${website.slug}`;
    await website.save();

    return res.status(200).json({
      success: true,
      url: website.deployUrl,
      slug: website.slug,
      deployed: website.deployed
    });
  } catch (error) {
    console.log("Deploy error:", error);
    return res.status(500).json({
      message: `Deploy request error: ${error.message}`
    });
  }
};


// website.controller.js
export const getWebsiteBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const website = await Website.findOne({ slug, deployed: true });
    
    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }
    
    return res.status(200).json({
      latestCode: website.latestCode,
      title: website.title
    });
  } catch (error) {
    console.log("getWebsiteBySlug error:", error.message);
    return res.status(500).json({
      message: error.message,
    });
  }
};