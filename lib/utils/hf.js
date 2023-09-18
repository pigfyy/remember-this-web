import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.NEXT_PUBLIC_HF_API_KEY);

const vqa = async (question, image) => {
  const res = await hf.visualQuestionAnswering({
    model: "dandelin/vilt-b32-finetuned-vqa",
    inputs: {
      question: question,
      image: await (await fetch(image)).blob(),
    },
  });

  return { res };
};

export { hf, vqa };
