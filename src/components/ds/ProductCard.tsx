import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Context ---

const ProductCardContext = React.createContext<{
  layout: "grid" | "list";
}>({ layout: "list" });

export function useProductCard() {
  return React.useContext(ProductCardContext);
}

// --- Root ---

interface ProductCardRootProps extends React.HTMLAttributes<HTMLDivElement> {
  layout?: "grid" | "list";
}

const ProductCardRoot = React.forwardRef<HTMLDivElement, ProductCardRootProps>(
  ({ className, layout = "list", children, ...props }, ref) => {
    return (
      <ProductCardContext.Provider value={{ layout }}>
        <Card
          ref={ref}
          className={cn(
            "group overflow-hidden cursor-pointer transition-all hover:shadow-md hover:border-primary/50 active:scale-[0.98]",
            layout === "list" ? "flex h-full flex-col sm:flex-row" : "flex h-full flex-col",
            className
          )}
          {...props}
        >
          {children}
        </Card>
      </ProductCardContext.Provider>
    );
  }
);
ProductCardRoot.displayName = "ProductCardRoot";

// --- Image ---

interface ProductCardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
}

const ProductCardImage = React.forwardRef<HTMLImageElement, ProductCardImageProps>(
  ({ className, containerClassName, alt = "", src, children, ...props }, ref) => {
    const { layout } = useProductCard();
    
    return (
      <div 
        className={cn(
          "relative overflow-hidden bg-muted",
          layout === "list" 
            ? "aspect-[4/3] w-full sm:w-32 sm:shrink-0 sm:aspect-square" 
            : "aspect-[4/3] w-full",
          containerClassName
        )}
      >
        {src ? (
          <img
            ref={ref}
            src={src}
            alt={alt}
            className={cn("h-full w-full object-cover transition-transform duration-500 group-hover:scale-105", className)}
            {...props}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-muted">
             {/* Fallback */}
          </div>
        )}
        {children}
      </div>
    );
  }
);
ProductCardImage.displayName = "ProductCardImage";

// --- Badge (Floating on Image) ---

interface ProductCardBadgeProps extends React.ComponentProps<typeof Badge> {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

const ProductCardBadge = React.forwardRef<HTMLDivElement, ProductCardBadgeProps>(
  ({ className, position = "top-left", ...props }, ref) => {
    return (
      <Badge
        ref={ref}
        className={cn(
          "absolute shadow-sm",
          {
            "top-2 left-2": position === "top-left",
            "top-2 right-2": position === "top-right",
            "bottom-2 left-2": position === "bottom-left",
            "bottom-2 right-2": position === "bottom-right",
          },
          className
        )}
        {...props}
      />
    );
  }
);
ProductCardBadge.displayName = "ProductCardBadge";

// --- Content Container ---

const ProductCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-1 flex-col justify-between p-4", className)}
        {...props}
      />
    );
  }
);
ProductCardContent.displayName = "ProductCardContent";

// --- Header (Title & Tags) ---

const ProductCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-start justify-between gap-2 mb-1", className)}
        {...props}
      />
    );
  }
);
ProductCardHeader.displayName = "ProductCardHeader";

const ProductCardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return (
      <h4
        ref={ref}
        className={cn("font-semibold leading-tight line-clamp-2", className)}
        {...props}
      />
    );
  }
);
ProductCardTitle.displayName = "ProductCardTitle";

// --- Description ---

const ProductCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("line-clamp-2 text-sm text-muted-foreground", className)}
        {...props}
      />
    );
  }
);
ProductCardDescription.displayName = "ProductCardDescription";

// --- Footer (Price & Action) ---

const ProductCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("mt-4 flex items-center justify-between", className)}
        {...props}
      />
    );
  }
);
ProductCardFooter.displayName = "ProductCardFooter";

const ProductCardPrice = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn("font-medium text-foreground", className)}
        {...props}
      />
    );
  }
);
ProductCardPrice.displayName = "ProductCardPrice";

const ProductCardAddButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
        {...props}
      >
        {children || <Plus className="h-4 w-4" />}
      </button>
    );
  }
);
ProductCardAddButton.displayName = "ProductCardAddButton";

// --- Main Export (Legacy Support + Compound) ---

interface LegacyProductCardProps extends ProductCardRootProps {
  title: string;
  description: string;
  price: string;
  imageUrl?: string;
  popular?: boolean;
}

export function ProductCard({
  title,
  description,
  price,
  imageUrl,
  popular,
  className,
  layout,
  ...props
}: LegacyProductCardProps) {
  return (
    <ProductCardRoot className={className} layout={layout} {...props}>
      {imageUrl && (
        <ProductCardImage src={imageUrl} alt={title}>
          {popular && <ProductCardBadge position="top-left" variant="secondary">Popular</ProductCardBadge>}
        </ProductCardImage>
      )}
      <ProductCardContent>
        <div>
          <ProductCardHeader>
            <ProductCardTitle>{title}</ProductCardTitle>
          </ProductCardHeader>
          <ProductCardDescription>{description}</ProductCardDescription>
        </div>
        <ProductCardFooter>
          <ProductCardPrice>{price}</ProductCardPrice>
          <ProductCardAddButton />
        </ProductCardFooter>
      </ProductCardContent>
    </ProductCardRoot>
  );
}

// Attach compound components
ProductCard.Root = ProductCardRoot;
ProductCard.Image = ProductCardImage;
ProductCard.Badge = ProductCardBadge;
ProductCard.Content = ProductCardContent;
ProductCard.Header = ProductCardHeader;
ProductCard.Title = ProductCardTitle;
ProductCard.Description = ProductCardDescription;
ProductCard.Footer = ProductCardFooter;
ProductCard.Price = ProductCardPrice;
ProductCard.AddButton = ProductCardAddButton;
