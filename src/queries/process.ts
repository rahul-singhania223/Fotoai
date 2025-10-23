import axios from "axios";

class Processor {
  constructor() {
    // axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
    axios.defaults.headers.post["Content-Type"] = "application/json";
    axios.defaults.withCredentials = true;
  }

  async removeBackground(imageUrl: string) {
    try {
      const res = await axios.post("/api/process/remove-bg", {
        imageUrl,
      });
      return res;
    } catch (error) {
      throw error;
    }
  }

  async upscale(imageUrl: string, settings: Settings) {
    try {
      const res = await axios.post("/api/process/upscale", {
        imageUrl,
        settings,
      });
      return res;
    } catch (error) {
      throw error;
    }
  }

  async lightFix(imageUrl: string, settings: Settings) {
    try {
      const res = await axios.post("/api/process/light-fix", {
        imageUrl,
        settings,
      });
      return res;
    } catch (error) {
      throw error;
    }
  }

  async processForPlatform(
    imageUrl: string,
    dimension: Dimension,
    format: string
  ) {
    try {
      const res = await axios.post("/api/process/platform", {
        imageUrl,
        dimension,
        format,
      });
      return res;
    } catch (error) {
      return error;
    }
  }
}

export const processor = new Processor();
