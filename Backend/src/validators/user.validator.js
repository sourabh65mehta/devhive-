import z from "zod"

export const createUserSchema = z.object({
    username:z.string().min(3,"minimum 3 charcters username is required "),
    email:z.string().email("invalid email address"),
    password:z.string().min(8,"minimum 8 charcters password is required "),
})
export const loginSchema = z.object({
    email:z.string().email("invalid email address"),
    password:z.string().min(8,"minimum 8 charcters password is required "),
})
export const logoutSchema = z.object({
    refresh_token:z.string().min(1,"refresh token is required "),
})


