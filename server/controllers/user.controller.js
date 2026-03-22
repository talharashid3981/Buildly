import  generateResponce  from "../config/openRouter.js";
import extractJson from "../utils/extractJson.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(500).json({ user: null });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "get current user error" });
  }
};

export const generateDemo = async (req, res) => {
  try {
    const result = await generateResponce(
      "can you generate a mear stack ecommerce website "
    );

    const data = extractJson(result);

    if (!data) {
      return res.status(500).json({
        message: "Invalid JSON returned from AI",
      });
    }

    return res.status(200).json(data);

  } catch (error) {
    console.log("generateDemo error:", error.message);
    return res.status(500).json({
      message: error.message,
    });
  }
};