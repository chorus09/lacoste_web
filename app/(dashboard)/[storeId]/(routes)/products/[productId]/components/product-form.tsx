"use client";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
   FormDescription,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

import { Product, Image, Category, Color, Size } from "@prisma/client";
import { Trash } from "lucide-react";

const formSchema = z.object({
   name: z.string().min(1),
   images: z.object({ url: z.string() }).array(),
   price: z.coerce.number().min(1),
   categoryId: z.string().min(1),
   colorId: z.string().min(1),
   sizeId: z.string().min(1),
   isFeatured: z.boolean().default(false).optional(),
   isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
   initialData?: (Product & { images: Image[] }) | null;
   categories: Category[];
   colors: Color[];
   sizes: Size[];
}

export const ProductForm: React.FC<ProductFormProps> = ({
   initialData,
   categories,
   colors,
   sizes,
}) => {
   const params = useParams();
   const router = useRouter();

   const title = initialData ? "Edit Product" : "Create Product";
   const description = initialData ? "Edit product details." : "Add a new product.";
   const toastMessage = initialData ? "Product updated." : "Product created.";
   const action = initialData ? "Save changes" : "Create";

   const [open, setOpen] = useState(false);
   const [loading, setLoading] = useState(false);

   const form = useForm<ProductFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: initialData
         ? {
            ...initialData,
            price: parseFloat(String(initialData.price)),
         }
         : {
            name: "",
            images: [],
            price: 0,
            categoryId: "",
            colorId: "",
            sizeId: "",
            isFeatured: false,
            isArchived: false,
         },
   });

   const onSubmit = async (data: ProductFormValues) => {
      try {
         setLoading(true);
         if (initialData) {
            await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);
         } else {
            await axios.post(`/api/${params.storeId}/products`, data);
         }
         router.refresh();
         router.push(`/${params.storeId}/products`);
         toast.success(toastMessage);
      } catch (error) {
         toast.error("Something went wrong.");
      } finally {
         setLoading(false);
      }
   };

   const onDelete = async () => {
      try {
         setLoading(true);
         await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
         router.refresh();
         router.push(`/${params.storeId}/products`);
         toast.success("Product deleted.");
      } catch (error) {
         toast.error("Make sure you removed all dependencies before deleting.");
      } finally {
         setLoading(false);
         setOpen(false);
      }
   };

   return (
      <>
         <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
         />
         <div className="flex items-center justify-between">
            <Heading title={title} description={description} />
            {initialData && (
               <Button
                  disabled={loading}
                  variant="destructive"
                  size="icon"
                  onClick={() => setOpen(true)}
               >
                  <Trash className="h-4 w-4" />
               </Button>
            )}
         </div>
         <Separator />
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
               <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Product Images</FormLabel>
                        <FormControl>
                           <ImageUpload
                              value={field.value.map((img) => img.url)}
                              disabled={loading}
                              onChange={(url) => field.onChange([...field.value, { url }])}
                              onRemove={(url) =>
                                 field.onChange(field.value.filter((current) => current.url !== url))
                              }
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                           <Input disabled={loading} placeholder="Product name" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                           <Input type="number" disabled={loading} placeholder="Product price" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                           disabled={loading}
                           onValueChange={field.onChange}
                           value={field.value}
                           defaultValue={field.value}
                        >
                           <FormControl>
                              <SelectTrigger>
                                 <SelectValue defaultValue={field.value} placeholder="Select a category" />
                              </SelectTrigger>
                           </FormControl>
                           <SelectContent>
                              {categories.map((category) => (
                                 <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="sizeId"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Size</FormLabel>
                        <Select
                           disabled={loading}
                           onValueChange={field.onChange}
                           value={field.value}
                           defaultValue={field.value}
                        >
                           <FormControl>
                              <SelectTrigger>
                                 <SelectValue defaultValue={field.value} placeholder="Select a size" />
                              </SelectTrigger>
                           </FormControl>
                           <SelectContent>
                              {sizes.map((size) => (
                                 <SelectItem key={size.id} value={size.id}>
                                    {size.name}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="colorId"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Color</FormLabel>
                        <Select
                           disabled={loading}
                           onValueChange={field.onChange}
                           value={field.value}
                           defaultValue={field.value}
                        >
                           <FormControl>
                              <SelectTrigger>
                                 <SelectValue defaultValue={field.value} placeholder="Select a color" />
                              </SelectTrigger>
                           </FormControl>
                           <SelectContent>
                              {colors.map((color) => (
                                 <SelectItem key={color.id} value={color.id}>
                                    <div className="flex items-center gap-2">
                                       {color.name}
                                       <span
                                          className="h-4 w-4 rounded-full border ml-2"
                                          style={{ backgroundColor: color.value }}
                                       />
                                    </div>
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                     <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                           <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={loading}
                           />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                           <FormLabel>Featured</FormLabel>
                           <FormDescription>
                              This product will appear on the home page
                           </FormDescription>
                        </div>
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="isArchived"
                  render={({ field }) => (
                     <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                           <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={loading}
                           />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                           <FormLabel>Archived</FormLabel>
                           <FormDescription>
                              Archived products will not appear anywhere in the store
                           </FormDescription>
                        </div>
                     </FormItem>
                  )}
               />
               <Button disabled={loading} className="ml-auto" type="submit">
                  {action}
               </Button>
            </form>
         </Form>
      </>
   );
};