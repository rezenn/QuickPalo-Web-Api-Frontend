// "use client";

// import React from "react";
// import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
// import { Eye, EyeOff } from "lucide-react";

// interface InputFieldProps {
//   label: string;
//   name: string;
//   type?: string;
//   placeholder?: string;
//   register: UseFormRegister<FieldValues>;
//   errors?: FieldErrors;
//   showPasswordToggle?: boolean; // optional for password fields
// }

// const InputField: React.FC<InputFieldProps> = ({
//   label,
//   name,
//   type = "text",
//   placeholder,
//   register,
//   errors,
//   showPasswordToggle = false,
// }) => {
//   const [showPassword, setShowPassword] = React.useState(false);
//   const isPassword = type === "password";

//   const inputType = isPassword && showPassword ? "text" : type;

//   return (
//     <div className="flex flex-col">
//       <label className="block text-md text-black/60 font-semibold mb-2">
//         {label}
//       </label>
//       <div className="relative">
//         <input
//           type={inputType}
//           {...register(name)}
//           placeholder={placeholder}
//           className="h-12 w-full rounded-md border border-black/30 bg-white px-4 text-black focus:outline-none focus:border-black/60"
//           aria-invalid={!!errors?.[name]}
//         />
//         {isPassword && showPasswordToggle && (
//           <button
//             type="button"
//             onClick={() => setShowPassword((v) => !v)}
//             className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none text-gray-500 hover:text-gray-800"
//             aria-label={showPassword ? "Hide password" : "Show password"}
//           >
//             {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//           </button>
//         )}
//       </div>
//       {errors?.[name]?.message && (
//         <p className="text-xs text-red-500 mt-1">
//           {errors[name]?.message?.toString()}
//         </p>
//       )}
//     </div>
//   );
// };

// export default InputField;
