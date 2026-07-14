import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerTrigger } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, ShoppingBag, Plus, Minus } from "lucide-react";
import { ProductCard } from "@/components/ds/ProductCard";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export function DesignSystemSection() {
  const [activeCategory, setActiveCategory] = useState("Popular");
  const [qty, setQty] = useState(1);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Enterprise Design System</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Reusable, accessible, and fast components built with shadcn/ui.
        </p>
      </div>

      {/* Buttons & Badges */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">Tokens: Buttons, Badges & Inputs</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4 rounded-xl border p-6 bg-card">
            <h3 className="text-sm font-medium text-muted-foreground">Buttons</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Button>Primary Action</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button className="rounded-full" size="icon"><Plus className="h-4 w-4"/></Button>
            </div>
            
            <h3 className="text-sm font-medium text-muted-foreground mt-8">Badges</h3>
            <div className="flex flex-wrap gap-4">
              <Badge>New</Badge>
              <Badge variant="secondary">Popular</Badge>
              <Badge variant="outline">Vegan</Badge>
              <Badge variant="destructive">Sold Out</Badge>
              <Badge className="bg-emerald-500 hover:bg-emerald-600">Gluten Free</Badge>
            </div>
          </div>
          
          <div className="space-y-4 rounded-xl border p-6 bg-card">
            <h3 className="text-sm font-medium text-muted-foreground">Inputs & Controls</h3>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search menu..." className="pl-9 bg-muted/50 border-none rounded-xl" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="airplane-mode" className="flex flex-col space-y-1">
                  <span>Vegetarian Only</span>
                  <span className="font-normal text-xs text-muted-foreground">Filter out meat items</span>
                </Label>
                <Switch id="airplane-mode" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cards & Navigation */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">Layout: Navigation & Cards</h2>
        
        <div className="space-y-4">
           <h3 className="text-sm font-medium text-muted-foreground">Scrollable Category Navigation (Sticky)</h3>
           <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar border rounded-xl p-4 bg-card shadow-sm">
             {["Popular", "Starters", "Mains", "Pizza", "Desserts", "Drinks"].map((cat) => (
               <Button 
                 key={cat}
                 variant={activeCategory === cat ? "default" : "secondary"}
                 className="rounded-full"
                 onClick={() => setActiveCategory(cat)}
               >
                 {cat}
               </Button>
             ))}
           </div>
        </div>

        <div className="mt-6 space-y-4">
           <h3 className="text-sm font-medium text-muted-foreground">Product Cards</h3>
           <div className="grid gap-4 md:grid-cols-2">
             <Drawer>
               <DrawerTrigger render={
                 <div className="w-full text-left">
                   <ProductCard.Root layout="list">
                     <ProductCard.Image src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80" alt="Truffle Burger">
                       <ProductCard.Badge variant="secondary" position="top-left">Popular</ProductCard.Badge>
                     </ProductCard.Image>
                     <ProductCard.Content>
                       <div>
                         <ProductCard.Header>
                           <ProductCard.Title>Truffle Burger</ProductCard.Title>
                         </ProductCard.Header>
                         <ProductCard.Description>
                           Double smash patty, truffle mayo, caramelized onions, brioche bun. Served with house fries.
                         </ProductCard.Description>
                       </div>
                       <ProductCard.Footer>
                         <ProductCard.Price>$18.00</ProductCard.Price>
                         <ProductCard.AddButton />
                       </ProductCard.Footer>
                     </ProductCard.Content>
                   </ProductCard.Root>
                 </div>
               } />
               <DrawerContent className="h-[90vh]">
                 <div className="mx-auto w-full max-w-lg h-full flex flex-col">
                   <div className="relative h-64 w-full shrink-0">
                     <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80" alt="Burger" className="absolute inset-0 h-full w-full object-cover" />
                     <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                   </div>
                   
                   <div className="flex-1 overflow-auto p-4 space-y-6">
                     <div>
                       <div className="flex justify-between items-start">
                         <DrawerTitle className="text-2xl font-bold">Truffle Burger</DrawerTitle>
                         <span className="text-xl font-medium">$18.00</span>
                       </div>
                       <DrawerDescription className="mt-2 text-base text-muted-foreground">
                         Double smash patty, truffle mayo, caramelized onions, brioche bun. Served with house fries.
                       </DrawerDescription>
                     </div>

                     <Separator />

                     <div className="space-y-4">
                       <div className="flex justify-between items-center">
                         <div>
                           <h4 className="font-semibold text-lg">Choose Meat Temperature</h4>
                           <p className="text-sm text-muted-foreground">Required &bull; Choose 1</p>
                         </div>
                         <Badge variant="secondary">Required</Badge>
                       </div>
                       <RadioGroup defaultValue="medium">
                         <div className="flex items-center justify-between space-x-2 border rounded-xl p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                           <Label htmlFor="r1" className="flex-1 cursor-pointer font-medium text-base">Medium Rare</Label>
                           <RadioGroupItem value="mr" id="r1" />
                         </div>
                         <div className="flex items-center justify-between space-x-2 border rounded-xl p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                           <Label htmlFor="r2" className="flex-1 cursor-pointer font-medium text-base">Medium</Label>
                           <RadioGroupItem value="medium" id="r2" />
                         </div>
                         <div className="flex items-center justify-between space-x-2 border rounded-xl p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                           <Label htmlFor="r3" className="flex-1 cursor-pointer font-medium text-base">Well Done</Label>
                           <RadioGroupItem value="wd" id="r3" />
                         </div>
                       </RadioGroup>
                     </div>

                     <div className="space-y-4">
                       <div className="flex justify-between items-center">
                         <div>
                           <h4 className="font-semibold text-lg">Add Extras</h4>
                           <p className="text-sm text-muted-foreground">Optional</p>
                         </div>
                       </div>
                       <div className="space-y-3">
                         <div className="flex items-center justify-between space-x-2">
                           <Label htmlFor="c1" className="flex-1 flex justify-between cursor-pointer font-medium">
                             <span>Extra Truffle Mayo</span>
                             <span className="text-muted-foreground">+$2.00</span>
                           </Label>
                           <Checkbox id="c1" />
                         </div>
                         <Separator />
                         <div className="flex items-center justify-between space-x-2">
                           <Label htmlFor="c2" className="flex-1 flex justify-between cursor-pointer font-medium">
                             <span>Bacon</span>
                             <span className="text-muted-foreground">+$3.00</span>
                           </Label>
                           <Checkbox id="c2" />
                         </div>
                       </div>
                     </div>
                   </div>

                   <DrawerFooter className="border-t bg-background pt-4 pb-8 shrink-0">
                     <div className="flex items-center gap-4 w-full">
                       <div className="flex items-center border rounded-full p-1 bg-muted/50 shrink-0">
                         <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={() => setQty(Math.max(1, qty - 1))}>
                           <Minus className="h-4 w-4" />
                         </Button>
                         <span className="w-8 text-center font-semibold text-lg">{qty}</span>
                         <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={() => setQty(qty + 1)}>
                           <Plus className="h-4 w-4" />
                         </Button>
                       </div>
                       <Button 
                         className="flex-1 h-12 text-lg rounded-full" 
                         onClick={() => toast.success("Added to cart")}
                       >
                         Add to order - ${(18 * qty).toFixed(2)}
                       </Button>
                     </div>
                   </DrawerFooter>
                 </div>
               </DrawerContent>
             </Drawer>

             <ProductCard.Root layout="list">
               <ProductCard.Image src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80" alt="Margherita Pizza" />
               <ProductCard.Content>
                 <div>
                   <ProductCard.Header>
                     <ProductCard.Title>Margherita Pizza</ProductCard.Title>
                   </ProductCard.Header>
                   <ProductCard.Description>
                     San Marzano tomato sauce, fresh mozzarella, basil, extra virgin olive oil.
                   </ProductCard.Description>
                 </div>
                 <ProductCard.Footer>
                   <ProductCard.Price>$14.00</ProductCard.Price>
                   <ProductCard.AddButton />
                 </ProductCard.Footer>
               </ProductCard.Content>
             </ProductCard.Root>

             <ProductCard.Root layout="list">
               {/* Product without an image */}
               <ProductCard.Content>
                 <div>
                   <ProductCard.Header>
                     <ProductCard.Title>Side Salad</ProductCard.Title>
                     <Badge variant="outline" className="shrink-0 text-emerald-600 border-emerald-600">Vegan</Badge>
                   </ProductCard.Header>
                   <ProductCard.Description>
                     Mixed greens, cherry tomatoes, balsamic vinaigrette.
                   </ProductCard.Description>
                 </div>
                 <ProductCard.Footer>
                   <ProductCard.Price>$6.00</ProductCard.Price>
                   <ProductCard.AddButton />
                 </ProductCard.Footer>
               </ProductCard.Content>
             </ProductCard.Root>
           </div>
        </div>
      </section>

      {/* Feedback & Loaders */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">Loaders, Ratings & Feedback</h2>
        <div className="grid gap-8 md:grid-cols-2">
           <div className="space-y-4 rounded-xl border p-6 bg-card">
             <h3 className="text-sm font-medium text-muted-foreground">Skeleton Loading</h3>
             <div className="flex flex-col sm:flex-row gap-4 h-full">
               <Skeleton className="h-32 w-full sm:w-32 rounded-xl" />
               <div className="space-y-2 flex-1">
                 <Skeleton className="h-4 w-[200px]" />
                 <Skeleton className="h-4 w-[150px]" />
                 <Skeleton className="h-4 w-[100px]" />
               </div>
             </div>
           </div>
           <div className="space-y-4 rounded-xl border p-6 bg-card">
             <h3 className="text-sm font-medium text-muted-foreground">Price & Rating</h3>
             <div className="flex flex-col gap-6">
                <div className="flex items-end gap-2">
                   <span className="text-3xl font-bold tracking-tight">$18.50</span>
                   <span className="text-muted-foreground line-through text-sm pb-1">$22.00</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-600">
                   {Array.from({length: 5}).map((_, i) => (
                     <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-500">
                       <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                     </svg>
                   ))}
                   <span className="text-sm font-medium text-foreground ml-2">4.9 (120+ reviews)</span>
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* Floating Elements */}
      <section className="space-y-4 pb-20">
        <h2 className="text-xl font-semibold border-b pb-2">Interaction: Feedback & Floating Cart</h2>
        <div className="flex flex-col gap-4 items-start">
           <Button onClick={() => toast("Item added to cart")}>Show Simple Toast</Button>
           <Button variant="outline" onClick={() => toast.success("Order placed successfully!", {
             description: "We'll notify you when it's ready."
           })}>Show Success Snackbar</Button>
        </div>
      </section>

      {/* Mock Floating Cart */}
      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none md:left-64">
        <div className="pointer-events-auto w-full max-w-sm rounded-full bg-primary p-2 pr-4 text-primary-foreground shadow-2xl flex items-center justify-between cursor-pointer hover:bg-primary/90 transition-colors hover:-translate-y-1 duration-300">
           <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 font-semibold">
               3
             </div>
             <span className="font-medium">View Cart</span>
           </div>
           <span className="font-bold">$42.00</span>
        </div>
      </div>
      
      <Toaster />
    </div>
  );
}
