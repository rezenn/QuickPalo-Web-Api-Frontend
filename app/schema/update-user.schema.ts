import { z } from "zod";

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const updateUserSchema = z.object({
  fullName: z.string().min(2, "Minimum 2 characters"),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().min(3, "Minimum 3 characters"),
  profileImage: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
      message: "Max file size is 5MB",
    })
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only jpg, jpeg, png, webp allowed",
    }),
});

export type UpdateUserData = z.infer<typeof updateUserSchema>;
