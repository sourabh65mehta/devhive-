import z from "zod"

const questionSchema = z.object({
    title:z.string().min(5,"title must be atleast 5 characters").max(255),
    body:z.string().min(10,"body must be atleast 10 characters"),
    image_url:z.string().url("must be valid url").optional()
})

export {questionSchema}