import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  LogOut,
  ArrowLeft,
  ImagePlus,
  Store,
  Star,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  type ProductAvailability,
  type StoreProduct,
  deleteProduct,
  getProducts,
  saveProduct,
  slugifyProductName,
} from "@/lib/products";
import { uploadImagesToStorage } from "@/lib/storage";
import { DEFAULT_HERO_IMAGE, getStoreSettings, saveStoreSettings } from "@/lib/storeSettings";

const CATEGORIES = ["Conjuntos", "Leggings", "Tops", "Shorts"];

const parseSizes = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim().toUpperCase())
    .filter(Boolean);

const moveItemToFront = (items: string[], indexToMove: number) => {
  const selected = items[indexToMove];
  const remaining = items.filter((_, index) => index !== indexToMove);
  return [selected, ...remaining];
};

const AdminDashboard = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<StoreProduct | null>(null);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [heroDescription, setHeroDescription] = useState("");

  const [form, setForm] = useState({
    slug: "",
    name: "",
    description: "",
    price: "",
    category: "Leggings",
    images: [] as string[],
    sizes: "P, M, G",
    active: true,
    availability: "disponivel" as ProductAvailability,
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: getProducts,
    enabled: isAdmin,
  });

  const { data: settingsData } = useQuery({
    queryKey: ["store-settings"],
    queryFn: getStoreSettings,
    enabled: isAdmin,
  });

  useEffect(() => {
    if (!settingsData) return;
    setHeroImages(settingsData.heroImages);
    setHeroDescription(settingsData.heroDescription);
  }, [settingsData]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/admin/login");
    }
  }, [authLoading, navigate, user]);

  const saveSettingsMutation = useMutation({
    mutationFn: async () => {
      await saveStoreSettings({
        heroImages,
        heroDescription,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-settings"] });
      toast.success("Banner principal atualizado!");
    },
    onError: () => toast.error("Não foi possível salvar o banner principal."),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      await saveProduct(
        {
          slug: form.slug.trim() || slugifyProductName(form.name),
          name: form.name,
          description: form.description || null,
          price: parseFloat(form.price),
          category: form.category,
          image_url: form.images[0] || null,
          images: form.images,
          sizes: parseSizes(form.sizes),
          active: form.active,
          availability: form.availability,
        },
        editingProduct?.id
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(editingProduct ? "Produto atualizado!" : "Produto adicionado!");
      resetForm();
      setDialogOpen(false);
    },
    onError: () => toast.error("Não foi possível salvar o produto."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produto removido!");
    },
    onError: () => toast.error("Não foi possível remover o produto."),
  });

  const resetForm = () => {
    setForm({
      slug: "",
      name: "",
      description: "",
      price: "",
      category: "Leggings",
      images: [],
      sizes: "P, M, G",
      active: true,
      availability: "disponivel",
    });
    setEditingProduct(null);
  };

  const openEdit = (product: StoreProduct) => {
    setEditingProduct(product);
    setForm({
      slug: product.slug,
      name: product.name,
      description: product.description || "",
      price: String(product.price),
      category: product.category,
      images: product.images,
      sizes: product.sizes.join(", "),
      active: product.active,
      availability: product.availability,
    });
    setDialogOpen(true);
  };

  const handleProductImagesChange = async (files: FileList | null) => {
    try {
      const uploadedImages = await uploadImagesToStorage(files, "products");
      if (uploadedImages.length === 0) return;

      setForm((current) => ({
        ...current,
        images: [...current.images, ...uploadedImages],
      }));
      toast.success("Imagens do produto enviadas com sucesso.");
    } catch {
      toast.error("Não foi possível carregar as imagens selecionadas.");
    }
  };

  const handleHeroImagesChange = async (files: FileList | null) => {
    try {
      const uploadedImages = await uploadImagesToStorage(files, "hero");
      if (uploadedImages.length === 0) return;

      setHeroImages((current) => [...current, ...uploadedImages]);
      toast.success("Imagens do banner enviadas com sucesso.");
    } catch {
      toast.error("Não foi possível carregar as imagens do banner.");
    }
  };

  const removeImage = (indexToRemove: number) => {
    setForm((current) => ({
      ...current,
      images: current.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const removeHeroImage = (indexToRemove: number) => {
    setHeroImages((current) => current.filter((_, index) => index !== indexToRemove));
  };

  const setCoverImage = (indexToMove: number) => {
    setForm((current) => ({
      ...current,
      images: moveItemToFront(current.images, indexToMove),
    }));
  };

  const setHeroCoverImage = (indexToMove: number) => {
    setHeroImages((current) => moveItemToFront(current, indexToMove));
  };

  const restoreOriginalHeroBanner = () => {
    setHeroImages((current) => {
      if (current.includes(DEFAULT_HERO_IMAGE)) {
        return moveItemToFront(current, current.indexOf(DEFAULT_HERO_IMAGE));
      }
      return [DEFAULT_HERO_IMAGE, ...current];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.images.length === 0) {
      toast.error("Anexe pelo menos uma imagem para o produto.");
      return;
    }

    saveMutation.mutate();
  };

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Carregando...</div>;
  }

  if (!user) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
        <h1 className="font-display text-3xl text-foreground">ACESSO NEGADO</h1>
        <p className="text-muted-foreground">Somente o administrador pode acessar este painel.</p>
        <Button variant="outline" onClick={() => navigate("/")}>
          Voltar para a loja
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-display text-2xl tracking-wider">PAINEL ADMIN</h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground sm:block">{user.email}</span>
            <Button variant="ghost" size="icon" onClick={() => void signOut()}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto space-y-10 px-4 py-8">
        <section className="rounded-3xl border border-[#252525] bg-[#141414] p-6">
          <div className="mb-6 flex items-start gap-4">
            <div className="rounded-2xl bg-[#1b1b1b] p-3 text-[#d4af6e]">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Banner principal do site</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Anexe uma ou mais imagens. Se houver mais de uma, o site alterna automaticamente a
                cada 10 segundos.
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-2">
              <Label htmlFor="hero-images-upload">Imagens do banner</Label>
              <Input
                id="hero-images-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => void handleHeroImagesChange(e.target.files)}
              />
            </div>

            <div className="space-y-3 rounded-2xl border border-[#252525] bg-black/20 p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f0cf93]">
                Boas práticas para o banner
              </p>
              <p className="text-sm text-muted-foreground">
                Use imagens verticais ou com bastante respiro lateral, boa iluminação e foco no
                produto. Prefira no máximo 3 banners para manter a experiência fluida.
              </p>
              <Button onClick={() => saveSettingsMutation.mutate()} disabled={saveSettingsMutation.isPending}>
                <ImagePlus className="mr-2 h-4 w-4" />
                {saveSettingsMutation.isPending ? "Salvando..." : "Salvar banner"}
              </Button>
              <Button type="button" variant="outline" onClick={restoreOriginalHeroBanner}>
                Restaurar banner original
              </Button>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <Label htmlFor="hero-description">Descrição do banner</Label>
            <Textarea
              id="hero-description"
              rows={4}
              value={heroDescription}
              onChange={(e) => setHeroDescription(e.target.value)}
              placeholder="Descreva a proposta principal da marca para a home."
            />
          </div>

          <div className="mt-6 space-y-3 rounded-2xl border border-[#252525] bg-black/20 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Galeria do banner</p>
                <p className="text-xs text-muted-foreground">
                  A primeira imagem será exibida primeiro no carrossel da home.
                </p>
              </div>
              <span className="text-xs uppercase tracking-[0.18em] text-[#f0cf93]">
                {heroImages.length} imagem(ns)
              </span>
            </div>

            {heroImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {heroImages.map((image, index) => (
                  <div
                    key={`${image.slice(0, 30)}-${index}`}
                    className="overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#111]"
                  >
                    <img src={image} alt={`Banner ${index + 1}`} className="aspect-[4/5] w-full object-cover" />
                    <div className="space-y-2 p-3">
                      {index === 0 ? (
                        <div className="inline-flex items-center gap-1 rounded-full bg-[#d4af6e]/15 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#f0cf93]">
                          <Star className="h-3 w-3" />
                          Primeiro banner
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => setHeroCoverImage(index)}
                        >
                          Trazer para o início
                        </Button>
                      )}

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="w-full text-destructive hover:text-destructive"
                        onClick={() => removeHeroImage(index)}
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhuma imagem anexada ainda. Selecione uma ou mais imagens acima.
              </p>
            )}
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Catálogo de produtos</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Cadastre slug da rota, galeria de imagens, descrição, tamanhos e disponibilidade.
              </p>
            </div>

            <Dialog
              open={dialogOpen}
              onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) resetForm();
              }}
            >
              <DialogTrigger asChild>
                <Button variant="secondary">
                  <Plus className="mr-2 h-4 w-4" /> Novo Produto
                </Button>
              </DialogTrigger>

              <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingProduct ? "Editar Produto" : "Novo Produto"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) =>
                          setForm((current) => ({
                            ...current,
                            name: e.target.value,
                            slug: editingProduct ? current.slug : slugifyProductName(e.target.value),
                          }))
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slug">Rota do produto</Label>
                      <Input
                        id="slug"
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: slugifyProductName(e.target.value) })}
                        placeholder="legging-cintura-alta-preta"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      rows={4}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="price">Preço (R$)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria</Label>
                      <select
                        id="category"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="availability">Tipo de venda</Label>
                      <select
                        id="availability"
                        value={form.availability}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            availability: e.target.value as ProductAvailability,
                          })
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="disponivel">Disponível</option>
                        <option value="encomenda">Encomenda</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="sizes">Tamanhos</Label>
                      <Input
                        id="sizes"
                        value={form.sizes}
                        onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                        placeholder="P, M, G, GG"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="product-images">Imagens do produto</Label>
                      <Input
                        id="product-images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => void handleProductImagesChange(e.target.files)}
                      />
                    </div>
                  </div>

                  <div className="space-y-3 rounded-2xl border border-[#252525] bg-black/20 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Galeria anexada</p>
                        <p className="text-xs text-muted-foreground">
                          A primeira imagem é usada como capa do produto.
                        </p>
                      </div>
                      <span className="text-xs uppercase tracking-[0.18em] text-[#f0cf93]">
                        {form.images.length} imagem(ns)
                      </span>
                    </div>

                    {form.images.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {form.images.map((image, index) => (
                          <div
                            key={`${image.slice(0, 30)}-${index}`}
                            className="overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#111]"
                          >
                            <img src={image} alt={`Imagem ${index + 1}`} className="aspect-square w-full object-cover" />
                            <div className="space-y-2 p-3">
                              {index === 0 ? (
                                <div className="inline-flex items-center gap-1 rounded-full bg-[#d4af6e]/15 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#f0cf93]">
                                  <Star className="h-3 w-3" />
                                  Capa
                                </div>
                              ) : (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  onClick={() => setCoverImage(index)}
                                >
                                  Definir capa
                                </Button>
                              )}

                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="w-full text-destructive hover:text-destructive"
                                onClick={() => removeImage(index)}
                              >
                                Remover
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Nenhuma imagem anexada ainda. Selecione uma ou mais imagens acima.
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={form.active}
                      onCheckedChange={(checked) => setForm({ ...form, active: checked })}
                    />
                    <Label>Produto ativo</Label>
                  </div>

                  <Button type="submit" className="w-full" disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? "Salvando..." : "Salvar produto"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <p className="text-muted-foreground">Carregando produtos...</p>
          ) : !products?.length ? (
            <div className="py-16 text-center text-muted-foreground">
              <p>Nenhum produto cadastrado ainda.</p>
              <p className="mt-1 text-sm">Clique em "Novo Produto" para começar.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 md:flex-row md:items-center"
                >
                  {product.image_url && (
                    <img src={product.image_url} alt={product.name} className="h-24 w-24 rounded-2xl object-cover" />
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-medium text-foreground">{product.name}</h3>
                      {!product.active && (
                        <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          Inativo
                        </span>
                      )}
                      <span className="rounded bg-secondary px-2 py-0.5 text-xs text-foreground">
                        {product.availability === "disponivel" ? "Disponível" : "Encomenda"}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      /{product.slug} · {product.category} · R$ {Number(product.price).toFixed(2).replace(".", ",")}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {product.sizes.length > 0 ? `Tamanhos: ${product.sizes.join(", ")}` : "Sem tamanhos cadastrados"}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {product.images.length} imagem(ns) na galeria
                    </p>
                  </div>

                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(product)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMutation.mutate(product.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
