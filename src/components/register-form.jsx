import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from 'react-hot-toast'
import axios from 'axios'
import { uploadImageToCloudinary, validateImageFile } from '../lib/imageUpload'

// Zod validation schema
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  mobile: z.string().min(10, 'Mobile number must be at least 10 digits').regex(/^\d+$/, 'Mobile number must contain only digits'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  image: z.any().optional()
})

export function RegisterForm() {
  const navigate = useNavigate()
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(registerSchema)
  })

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        // Validate the image file
        validateImageFile(file)
        
        setValue('image', file)
        
        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreview(e.target.result)
        }
        reader.readAsDataURL(file)
      } catch (error) {
        toast.error(error.message)
        // Reset the file input
        e.target.value = ''
      }
    }
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      let imagePath = null
      
      // Handle image upload if provided
      if (data.image) {
        try {
          imagePath = await uploadImageToCloudinary(data.image)
          toast.success('Image uploaded successfully!')
        } catch (error) {
          toast.error(error.message || 'Failed to upload image. Please try again.')
          return
        }
      }

      const userData = {
        name: data.name,
        mobile: data.mobile,
        email: data.email,
        password: data.password,
        state: data.state,
        city: data.city,
        description: data.description,
        image: imagePath || '/profile-placeholder.png'
      }

      const BackendUrl = import.meta.env.VITE_BACKEND_URL
      
      const response = await axios.post(`${BackendUrl}/api/auth/register`, userData)
      console.log(response.data)
      
      if (response.data.message === 'User registered successfully') {
        toast.success('Registration successful! Please login to continue.')
        navigate('/login')
      } else {
        toast.error(response.data.error || 'Registration failed')
      }
      
    } catch (error) {
      console.error('Registration error:', error)
      if (error.response?.data?.error) {
        toast.error(error.response.data.error)
      } else {
        toast.error('Registration failed. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-screen">
      <Card className="w-full max-w-md shadow-2xl border border-blue-200/50 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-bold text-blue-700 mb-2">
            Join Us Today
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg">
            Create your account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* Name Field */}
              <div className="grid gap-3">
                <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  {...register("name")}
                  className="focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
  
              {/* Mobile Field */}
              <div className="grid gap-3">
                <Label htmlFor="mobile" className="text-gray-700">Mobile Number</Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter your mobile number"
                  {...register("mobile")}
                  className="focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
                {errors.mobile && (
                  <p className="text-sm text-red-500">{errors.mobile.message}</p>
                )}
              </div>
  
              {/* Email Field */}
              <div className="grid gap-3">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className="focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
  
              {/* Password Field */}
              <div className="grid gap-3">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  className="focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
  
              {/* State and City Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="state" className="text-gray-700">State</Label>
                  <Input
                    id="state"
                    type="text"
                    placeholder="Enter your state"
                    {...register("state")}
                    className="focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                  {errors.state && (
                    <p className="text-sm text-red-500">{errors.state.message}</p>
                  )}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="city" className="text-gray-700">City</Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Enter your city"
                    {...register("city")}
                    className="focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                  {errors.city && (
                    <p className="text-sm text-red-500">{errors.city.message}</p>
                  )}
                </div>
              </div>
  
              {/* Description Field */}
              <div className="grid gap-3">
                <Label htmlFor="description" className="text-gray-700">Description</Label>
                <textarea
                  id="description"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm 
                             focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  placeholder="Tell us about yourself..."
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>
  
              {/* Image Upload Field */}
              <div className="grid gap-3">
                <Label htmlFor="image" className="text-gray-700">Profile Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-full border border-blue-300 shadow-sm"
                    />
                  </div>
                )}
                {errors.image && (
                  <p className="text-sm text-red-500">{errors.image.message}</p>
                )}
              </div>
  
              {/* Submit Button */}
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            </div>
  
            {/* Login Link */}
            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:text-blue-800 font-semibold underline underline-offset-4 transition-colors duration-200"
              >
                Sign in here
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );  
}
