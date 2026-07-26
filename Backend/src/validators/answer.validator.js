import z from "zod"

export const answerSchema = z.object({
   
    body:z.string().min(5,"minimum 5 charcters answer is required "),
    image_url:z.string().optional()
})

export const updateAnswerSchema = z.object({
    body:z.string().min(5,"minimum 5 charcters answer is required ").optional(),
    image_url:z.string().optional()
})

