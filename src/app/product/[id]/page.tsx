"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import {
  ArrowLeft,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Zap,
  Shield,
  Truck,
  Box,
  Hash,
  Percent,
} from "lucide-react";

interface Product {
  productId: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  inventoryQty: number;
  images: string[];
  sellerId: string;
  cartonQty?: number;
  hsnCode?: string;
  gstPercentage?: number;
}

function ImageMagnifier({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [showMagnifier, setShowMagnifier] = useState(false);

  return (
    <div className="relative bg-white rounded-2xl border overflow-hidden h-[420px] flex items-center justify-center">
      <img
        src={src}
        alt={alt}
        className="max-h-full max-w-full object-contain cursor-zoom-in"
        onMouseEnter={(e) => {
          const elem = e.currentTarget;
          const { width, height } =
            elem.getBoundingClientRect();
          setSize([width, height]);
          setShowMagnifier(true);
        }}
        onMouseMove={(e) => {
          const elem = e.currentTarget;
          const { top, left } =
            elem.getBoundingClientRect();

          const x =
            e.pageX - left - window.scrollX;
          const y =
            e.pageY - top - window.scrollY;

          setXY([x, y]);
        }}
        onMouseLeave={() =>
          setShowMagnifier(false)
        }
      />

      {showMagnifier && (
        <div
          style={{
            position: "absolute",
            pointerEvents: "none",
            width: "180px",
            height: "180px",
            top: `${y - 90}px`,
            left: `${x - 90}px`,
            border: "2px solid #2563eb",
            borderRadius: "50%",
            backgroundImage: `url('${src}')`,
            backgroundRepeat: "no-repeat",
            backgroundColor: "white",
            backgroundSize: `${imgWidth * 2.5}px ${
              imgHeight * 2.5
            }px`,
            backgroundPosition: `${
              -x * 2.5 + 90
            }px ${-y * 2.5 + 90}px`,
            zIndex: 30,
            boxShadow:
              "0 15px 35px rgba(0,0,0,.15)",
          }}
        />
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const { id } = params;

  const [product, setProduct] =
    useState<Product | null>(null);

  const [allProducts, setAllProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [activeImgIndex, setActiveImgIndex] =
    useState(0);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);

        const productRes = await fetch(
          `https://easyecomserver.vercel.app/api/products/${id}`
        );

        const productData =
          await productRes.json();

        if (productData.success) {
          setProduct(productData.product);
        }

        const allRes = await fetch(
          "https://easyecomserver.vercel.app/api/products"
        );

        const allData = await allRes.json();

        if (allData.success) {
          setAllProducts(allData.products);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (id) loadProduct();
  }, [id]);

  if (loading || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="max-w-7xl mx-auto w-full px-4 py-8 flex-1">
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="h-[500px] rounded-2xl" />

            <div className="space-y-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const relatedProducts = allProducts
    .filter(
      (p) =>
        p.category === product.category &&
        p.productId !== product.productId
    )
    .slice(0, 5);

  const currentImage =
    product.images?.[activeImgIndex] ||
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800";

  const handleAddToCart = () => {
    if (product.inventoryQty <= 0) return;

    addToCart({
      productId: product.productId,
      title: product.title,
      price: product.price,
      qty: 1,
      sellerId: product.sellerId,
      image: currentImage,
    });

    alert("Item added to cart 🛒");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 py-8 flex-1">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium mb-6 hover:text-blue-600 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <Card className="overflow-hidden bg-white shadow-lg border-0">
          <CardContent className="p-6 md:p-8">
            <div className="grid lg:grid-cols-2 gap-10">
              {/* LEFT */}
              <div>
                <div className="relative group">
                  <ImageMagnifier
                    src={currentImage}
                    alt={product.title}
                  />

                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setActiveImgIndex((prev) =>
                            prev === 0
                              ? product.images.length -
                                1
                              : prev - 1
                          )
                        }
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white border rounded-full p-2 shadow opacity-0 group-hover:opacity-100 transition"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() =>
                          setActiveImgIndex((prev) =>
                            prev ===
                            product.images.length - 1
                              ? 0
                              : prev + 1
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white border rounded-full p-2 shadow opacity-0 group-hover:opacity-100 transition"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {product.images?.length > 1 && (
                  <div className="flex gap-3 mt-4 overflow-x-auto">
                    {product.images.map(
                      (img, index) => (
                      <button
                        key={index}
                          onClick={() =>
                            setActiveImgIndex(index)
                          }
                        className={`h-20 w-20 rounded-xl overflow-hidden border-2 shrink-0 ${
                            activeImgIndex === index
                              ? "border-blue-600"
                              : "border-gray-200"
                        }`}
                      >
                          <img
                            src={img}
                            className="h-full w-full object-cover"
                            alt=""
                          />
                      </button>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* RIGHT */}
              <div className="space-y-6">
                <Badge variant="secondary">
                  {product.category}
                </Badge>

                <h1 className="text-4xl font-bold leading-tight">
                  {product.title}
                </h1>

                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold">
                    ₹{product.price}
                  </span>

                  {product.originalPrice && (
                    <span className="line-through text-gray-400">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>

                <Badge
                  variant={
                    product.inventoryQty > 0
                      ? "default"
                      : "destructive"
                  }
                >
                  {product.inventoryQty > 0
                    ? `${product.inventoryQty} In Stock`
                    : "Out Of Stock"}
                </Badge>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <Box className="h-4 w-4 text-blue-600 shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Carton Qty</span>
                      <span className="text-xs font-bold text-slate-800">{product.cartonQty || "0"} Pcs</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 border-t sm:border-t-0 sm:border-x border-slate-200 pt-2 sm:pt-0 sm:px-3">
                    <Hash className="h-4 w-4 text-purple-600 shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">HSN Code</span>
                      <span className="text-xs font-bold text-slate-800">{product.hsnCode || "N/A"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 border-t sm:border-t-0 pt-2 sm:pt-0 sm:pl-1">
                    <Percent className="h-4 w-4 text-green-600 shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">GST</span>
                      <span className="text-xs font-bold text-slate-800">{product.gstPercentage || "0"}% Included</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 leading-7">{product.description}</p>

                {/* Features */}
                <div className="grid gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100">
                    <Truck className="h-5 w-5 text-blue-600" />
                    <span className="text-sm">
                      Fast Delivery Available
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span className="text-sm">
                      Secure Checkout
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm">Quality Assured Product</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Button
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={product.inventoryQty <= 0}
                    className="h-12 cursor-pointer"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add To Cart
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleBuyNow}
                    disabled={product.inventoryQty <= 0}
                    className="h-12 cursor-pointer"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description Section */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">
              Product Description
            </h2>

            <p className="text-gray-600 leading-7">
              {product.description}
            </p>
          </CardContent>
        </Card>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-bold mb-6">
              Related Products
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.productId}
                  productId={p.productId}
                  title={p.title}
                  price={p.price}
                  imageUrl={p.images?.[0]}
                  inventoryQty={p.inventoryQty}
                  sellerId={p.sellerId}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}