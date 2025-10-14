'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import InputField from '@/components/forms/InputFields'; // Fixed: InputFields → InputField
import FooterLink from '@/components/forms/FooterLink';
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {signInWithEmail, signUpWithEmail} from "@/lib/actions/auth.actions";

// Define the form data type
interface SignInFormData {
    email: string;
    password: string;
}

const SignIn = () => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onBlur',
    });

    // Add the missing onSubmit function
    const onSubmit = async (data: SignInFormData) => {
        try {

            const result = await signInWithEmail(data);
            if (result.success) router.push('/');

            // Temporary mock implementation
            console.log('Form data:', data);
            toast.success('Sign in successful!');
            router.push('/');
        } catch (e) {
            console.error(e);
            toast.error('Sign in failed', {
                description: e instanceof Error ? e.message : 'Failed to sign in.'
            });
        }
    };

    return (
        <>
            <h1 className="form-title">Welcome back</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <InputField
                    name="email"
                    label="Email"
                    placeholder="example@mail.com" // Fixed: added @ symbol
                    register={register}
                    error={errors.email}
                    validation={{
                        required: 'Email is required',
                        pattern: {
                            value: /^\w+@\w+\.\w+$/,
                            message: 'Invalid email format'
                        }
                    }}
                />

                <InputField
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{
                        required: 'Password is required',
                        minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters'
                        }
                    }}
                />

                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                    {isSubmitting ? 'Signing In' : 'Sign In'}
                </Button>

                <FooterLink
                    text="Don't have an account?"
                    linkText="Create an account"
                    href="/sign-up"
                />
            </form>
        </>
    );
};

export default SignIn;