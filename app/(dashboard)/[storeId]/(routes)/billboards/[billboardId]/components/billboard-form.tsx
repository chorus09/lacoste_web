"use client";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useOrigin } from "@/hooks/use-origin";
import { Billboard } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface BillboardFormProps {
   initialData?: Billboard | null; 
}

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});

type BillboardFormValues = z.infer<typeof formSchema>;

export const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => {
   const params = useParams();
   const router = useRouter();

   const title = initialData ? "Edit Billboard" : "Create Billboard";
   const description = initialData ? "Edit billboard details." : "Add a new billboard.";
   const toastMessage = initialData ? "Billboard updated." : "Billboard created.";
   const action = initialData ? "Save changes" : "Create";

   const [open, setOpen] = useState(false);
   const [loading, setLoading] = useState(false);

   const form = useForm<BillboardFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         label: initialData?.label || "",
         imageUrl: initialData?.imageUrl || "",
      },
   })

   const onSubmit = async (data: BillboardFormValues) => {
      try{
         setLoading(true);
         if(initialData) {
            await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
         } else {
            await axios.post(`/api/${params.storeId}/billboards`, data);
         }
         router.refresh();
         router.push(`/${params.storeId}/billboards`)
         toast.success(toastMessage);
      } catch(error) {
         toast.error("Something went wrong.")
      } finally {
         setLoading(false);
      }
   };

   const onDelete = async () => {
      try {
         setLoading(true);
         console.log(params.storeId)
         await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
         router.refresh();
         router.push(`/${params.storeId}/billboards`);
         toast.success("Billboard deleted.");
      } catch(error) {
         toast.error("Make sure you removed all categories using this billboard first.")
      } finally {
         setLoading(false);
         setOpen(false);
      }
   }

   return (
      <> 
         <AlertModal 
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
         />
         <div className="flex items-center justify-between">
            <Heading 
               title={title}
               description={description}
            />
            {initialData && (
               <Button
                  disabled={loading}
                  variant="destructive"
                  size="icon"
                  onClick={() => setOpen(true)}>
                     <Trash className="h-4 w-4"/>
               </Button>
            )}
         </div>
         <Separator />
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
               <div className="grid grid-cols-3 gap-8">
                  <FormField 
                     control={form.control}
                     name="imageUrl"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Background Image</FormLabel>
                           <FormControl>
                              <ImageUpload
                                 value={field.value ? [field.value] : []}
                                 disabled={loading}
                                 onChange={(url) => field.onChange(url)}
                                 onRemove={() => field.onChange("")}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>
               <div className="grid grid-cols-3 gap-8">
                  <FormField 
                     control={form.control}
                     name="label"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Label</FormLabel>
                           <FormControl>
                              <Input disabled={loading} placeholder="Billboard label" {...field}/>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>
               <Button disabled={loading} className="ml-auto" type="submit">
                  {action}
               </Button>
            </form>
         </Form>
      </>
   );
};