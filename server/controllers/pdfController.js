import axios from "axios";

export const proxyPDF = async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ message: "Missing PDF URL" });

    // Replace image with raw if missed
    const fixedUrl = url.replace("/image/upload/", "/raw/upload/");
    console.log("🔗 Proxying fixed URL:", fixedUrl);

    const response = await axios.get(fixedUrl, { responseType: "stream" });

    // Force correct headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=\"paper.pdf\"");
    res.setHeader("Cache-Control", "public, max-age=3600");

    // Pipe PDF stream directly to client
    response.data.pipe(res);
  } catch (error) {
    console.error("❌ PDF Proxy Error:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      res.status(error.response.status).json({ message: "Upstream Cloudinary Error" });
    } else {
      res.status(500).json({ message: "Failed to fetch PDF" });
    }
  }
};
