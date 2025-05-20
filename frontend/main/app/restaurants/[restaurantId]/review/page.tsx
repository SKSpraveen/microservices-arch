"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star, ArrowLeft, Camera, Utensils, Twitter, Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function ReviewPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [title, setTitle] = useState("")
  const [photos, setPhotos] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Sample restaurant data
  const restaurant = {
    id: params.restaurantId,
    name: "Burger Palace",
    image: "/placeholder.svg?height=100&width=100",
  }

  const handleRatingChange = (value:any) => {
    setRating(value)
  }

  const handleMouseEnter = (value:any) => {
    setHoverRating(value)
  }

  const handleMouseLeave = () => {
    setHoverRating(0)
  }

  const handlePhotoUpload = (e:any) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      // In a real app, you would upload these to a server
      // For now, we'll just create object URLs
      const newPhotos = files.map((file:any) => ({
        id: Math.random().toString(36).substring(7),
        url: URL.createObjectURL(file),
        name: file.name,
      }))
      setPhotos([...photos, ...newPhotos])
    }
  }

  const removePhoto = (photoId: any) => {
    setPhotos(photos.filter((photo) => photo.id !== photoId))
  }

  const handleSubmit = (e:any)  => {
    e.preventDefault()

    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting your review",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      })
      router.push(`/restaurants/${params.restaurantId}`)
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* <MainNav /> */}

      <div className="container px-4 py-6">
        <Button variant="ghost" className="mb-4 -ml-2" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">Write a Review</h1>
            <p className="text-muted-foreground mt-2">Share your experience at {restaurant.name}</p>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                  <Image
                    src={restaurant.image || "/placeholder.svg"}
                    alt={restaurant.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardTitle>{restaurant.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating */}
                <div className="space-y-2">
                  <Label>Your Rating</Label>
                  <div className="flex justify-center">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          className="p-1"
                          onClick={() => handleRatingChange(value)}
                          onMouseEnter={() => handleMouseEnter(value)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <Star
                            className={`h-8 w-8 ${
                              (hoverRating || rating) >= value ? "fill-yellow-500 text-yellow-500" : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  {rating > 0 && (
                    <p className="text-center text-sm text-muted-foreground">
                      {["Poor", "Fair", "Good", "Very Good", "Excellent"][rating - 1]}
                    </p>
                  )}
                </div>

                {/* Review Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Review Title</Label>
                  <Input
                    id="title"
                    placeholder="Summarize your experience"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="rounded-lg"
                  />
                </div>

                {/* Review Text */}
                <div className="space-y-2">
                  <Label htmlFor="review">Your Review</Label>
                  <Textarea
                    id="review"
                    placeholder="Tell us about your experience. What did you like or dislike? Would you recommend this restaurant to others?"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="min-h-[150px] rounded-lg"
                  />
                </div>

                {/* Photo Upload */}
                <div className="space-y-2">
                  <Label>Add Photos (Optional)</Label>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {photos.map((photo) => (
                      <div key={photo.id} className="relative h-24 w-24 rounded-lg overflow-hidden group">
                        <Image src={photo.url || "/placeholder.svg"} alt={photo.name} fill className="object-cover" />
                        <button
                          type="button"
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                          onClick={() => removePhoto(photo.id)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}

                    <label className="h-24 w-24 rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                      <Camera className="h-6 w-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground mt-1">Add Photo</span>
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You can upload up to 5 photos. Max file size: 5MB each.
                  </p>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button type="button" variant="outline" className="rounded-full" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" className="gradient-bg text-white rounded-full" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              Your review will be posted publicly on QuickBite. By submitting, you agree to our
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 md:py-16 mt-auto">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Utensils className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">QuickBite</span>
              </div>
              <p className="text-gray-400 mb-4">
                Delivering delicious food from your favorite local restaurants straight to your door.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <Instagram className="h-5 w-5" />
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {["Home", "About Us", "Restaurants", "Pricing", "Contact"].map((link, index) => (
                  <li key={index}>
                    <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                {["Terms of Service", "Privacy Policy", "Cookie Policy", "Refund Policy"].map((link, index) => (
                  <li key={index}>
                    <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <span className="text-gray-400">123 Delivery St, Food City, FC 12345</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="text-gray-400">support@quickbite.com</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="text-gray-400">+1 (555) 123-4567</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} QuickBite. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

