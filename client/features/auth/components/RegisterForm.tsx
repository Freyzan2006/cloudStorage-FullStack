import { Title } from "@/common/components/ui/Title"
import { useForm } from "react-hook-form";
import { authService } from "../service/AuthService";
import { Form, Input } from "@heroui/react"
import { TRegisterFormDTO } from "../dto/auth.dto";
import { setCookie } from "nookies";
import { Button } from "@heroui/button";
import React from "react";
import { AxiosError } from "axios";


export const RegisterForm: React.FC = () => {
    const { register, handleSubmit, formState: { errors, isValid, isSubmitSuccessful }, setError } = useForm<TRegisterFormDTO>({
        mode: "onChange"
    });

    const [loading, setLoading] = React.useState(false);

    const onSubmit = async (data: TRegisterFormDTO) => {
        try {
            setLoading(true)
            const { token } = await authService.register(data);
            console.log(token)
            console.log(data)
            setCookie(null, "_token", token, {
                path: "/",
            })
            location.href = "/dashboard"
            return data
        } catch(err: unknown) {
            console.warn("RegisterForm: ", err);

            let errorMessage = "Произошла ошибка, попробуйте снова.";

            if (err instanceof AxiosError) { 
                // Если это ошибка axios (например, 401 Unauthorized)
                errorMessage = err.response?.data?.message || "Ошибка авторизации.";
            } else if (err instanceof Error) {
                // Если это стандартная ошибка JavaScript
                errorMessage = err.message;
            }
    
            setError("root", {
                type: "manual",
                message: errorMessage,
            });
        } finally {
            setLoading(false)
        }
    };


    return (
        <div>
            <Title>
              Зарегистрировался
            </Title>
            <Form
            className="w-full justify-center items-center space-y-4"
            onSubmit={handleSubmit(onSubmit)}
            >
            <div className="flex flex-col gap-4 max-w-md">
 

                <Input
                isRequired
                {...register("email", { required: true })}
                errorMessage = { errors.email?.message }

                label="Email"
                labelPlacement="outside"
                name="email"
                placeholder="Введите email"
                type="email"
                />

                <Input
                    isRequired
                    {...register("fullName", { required: true })}
                    errorMessage = { errors.email?.message }

                    label="fullName"
                    labelPlacement="outside"
                    name="fullName"
                    placeholder="Введите полное имя"
                    type="text"
                />

                <Input
                isRequired
          
                {...register("password", { required: true })}
                errorMessage = { errors.password?.message }
             
                label="Password"
                labelPlacement="outside"
                name="password"
                placeholder="Введите пароль"
                type="password"
     
                />

                <div className="flex gap-4">
                {
                    loading 
                    ? 
                    <Button isLoading className={`w-full text-sm font-normal  ${isValid ? "text-primary-500" : "text-default-600 bg-default-100"}`}  type="submit" disabled = { isValid ? false : true }>
                        Зарегистрировался
                    </Button>
                    :
                    <Button className={`w-full text-sm font-normal  ${isValid ? "text-primary-500" : "text-default-600 bg-default-100"}`}  type="submit" disabled = { isValid ? false : true }>
                        Зарегистрировался
                    </Button>
                }
                <Button type="reset" variant="bordered">
                    Очистить
                </Button>
                </div>
                { isSubmitSuccessful && <div className="text-primary-500">Вы успешно создали и вошли в аккаунт</div> }
            </div>

            </Form>
        </div>
    )
}