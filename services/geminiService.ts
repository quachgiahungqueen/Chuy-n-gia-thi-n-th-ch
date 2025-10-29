
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

function dataUrlToBlob(dataUrl: string): { mimeType: string; data: string } {
  const parts = dataUrl.split(',');
  const meta = parts[0].match(/:(.*?);/);
  if (!meta || meta.length < 2) {
    throw new Error("Invalid Data URL format");
  }
  const mimeType = meta[1];
  const data = parts[1];
  return { mimeType, data };
}


export const analyzeStone = async (imageDataUrl: string): Promise<string> => {
  try {
    const { mimeType, data } = dataUrlToBlob(imageDataUrl);

    const imagePart = {
      inlineData: {
        mimeType,
        data,
      },
    };

    const prompt = `
Bạn là một chuyên gia hàng đầu thế giới, một giáo sư chuyên ngành về đá quý và thiên thạch với hàng chục năm kinh nghiệm. Nhiệm vụ của bạn là phân tích hình ảnh được cung cấp và đưa ra một báo cáo chi tiết, chuyên nghiệp, và hấp dẫn bằng tiếng Việt.

Dựa vào hình ảnh này, hãy thực hiện các yêu cầu sau và định dạng đầu ra với các tiêu đề rõ ràng:

1. NHẬN DIỆN: Xác định đối tượng trong ảnh là thiên thạch, đá quý, hay đá thông thường. Nêu rõ tên loại cụ thể nếu có thể (ví dụ: Thiên thạch Pallasite, Đá Ruby, Đá Granite).

2. PHÂN TÍCH CHUYÊN SÂU: Giải thích chi tiết TẠI SAO bạn đưa ra kết luận đó. Dẫn chứng các đặc điểm nhìn thấy được trong ảnh (ví dụ: lớp vỏ nóng chảy - fusion crust, các vết lõm - regmaglypts đối với thiên thạch; màu sắc, độ trong, đường cắt đối với đá quý; cấu trúc, thớ đá đối với đá thường). Hãy viết như một chuyên gia đang giải thích cho người khác.

3. CÂU CHUYỆN ĐẲNG CẤP (Nếu là Thiên thạch): Nếu vật thể là thiên thạch, hãy viết một đoạn văn đầy cảm hứng về giá trị sưu tầm và sự đẳng cấp của việc sở hữu nó. Nhấn mạnh rằng đây là "trò chơi của các tỷ phú", so sánh sự khan hiếm tuyệt đối của thiên thạch (đến từ vũ trụ) với đá quý (vẫn có thể khai thác trên Trái Đất). Mô tả nó như một vật phẩm mang lại may mắn, tài lộc từ ngoài hành tinh cho chủ nhân. Nếu không phải thiên thạch, bỏ qua phần này.

4. ƯỚC TÍNH GIÁ TRỊ: Dựa trên phân tích, hãy đưa ra một khoảng giá trị ước tính cho vật phẩm này bằng Việt Nam Đồng (VND). Hãy giải thích ngắn gọn cơ sở của ước tính đó.
    `;
    
    const textPart = {
        text: prompt,
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to analyze image with Gemini API.");
  }
};
