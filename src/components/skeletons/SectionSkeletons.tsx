import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const HeroSkeleton = () => (
  <section className="min-h-screen flex items-center justify-center bg-background">
    <div className="container mx-auto px-4 flex flex-col items-center text-center space-y-8">
      <Skeleton className="w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-full" />
      <Skeleton className="h-12 sm:h-14 lg:h-16 w-64 sm:w-80 rounded-lg" />
      <Skeleton className="h-8 w-48 sm:w-64 rounded-lg" />
      <Skeleton className="h-20 w-full max-w-xl rounded-lg" />
      <div className="flex gap-4">
        <Skeleton className="h-12 w-36 rounded-lg" />
        <Skeleton className="h-12 w-28 rounded-lg" />
      </div>
    </div>
  </section>
);

export const AboutSkeleton = () => (
  <section className="py-20 lg:py-32 bg-secondary/30">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <Skeleton className="h-10 w-48 mx-auto mb-4 rounded-lg" />
        <Skeleton className="h-5 w-72 mx-auto rounded-lg" />
      </div>
      <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
        <Skeleton className="w-full max-w-md h-80 rounded-2xl mx-auto" />
        <div className="space-y-6">
          <Skeleton className="h-6 w-40 rounded-lg" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
          <div className="grid grid-cols-2 gap-4 pt-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export const ExperienceSkeleton = () => (
  <section className="py-20 lg:py-32 bg-gradient-to-br from-background via-background to-primary/5">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <Skeleton className="h-10 w-48 mx-auto mb-4 rounded-lg" />
        <Skeleton className="h-5 w-72 mx-auto rounded-lg" />
      </div>
      <div className="max-w-4xl mx-auto space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="grid md:grid-cols-2 gap-8">
            <div className={i % 2 === 0 ? "md:col-start-2" : ""}>
              <Skeleton className="h-48 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const EducationSkeleton = () => (
  <section className="py-20 lg:py-32 bg-muted/30">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <Skeleton className="h-10 w-40 mx-auto mb-4 rounded-lg" />
        <Skeleton className="h-5 w-72 mx-auto rounded-lg" />
      </div>
      <div className="max-w-4xl mx-auto space-y-8">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    </div>
  </section>
);

export const ProjectsSkeleton = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <div className="text-center mb-8">
        <Skeleton className="h-10 w-40 mx-auto mb-4 rounded-lg" />
        <Skeleton className="h-5 w-72 mx-auto rounded-lg" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardHeader>
              <Skeleton className="h-5 w-3/4 rounded" />
              <Skeleton className="h-4 w-1/2 rounded" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
              <Skeleton className="h-9 w-28 rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export const CertificatesSkeleton = () => (
  <section className="py-12 sm:py-16 px-4 bg-muted/30">
    <div className="container mx-auto max-w-6xl">
      <div className="text-center mb-8 sm:mb-12">
        <Skeleton className="h-10 w-40 mx-auto mb-4 rounded-lg" />
        <Skeleton className="h-5 w-72 mx-auto rounded-lg" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-36 sm:h-48 w-full" />
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4 rounded" />
                  <Skeleton className="h-4 w-1/2 rounded" />
                </div>
              </div>
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-9 w-full rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export const ContactSkeleton = () => (
  <section className="py-20 lg:py-32 bg-gradient-to-br from-background via-background to-primary/5">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <Skeleton className="h-10 w-40 mx-auto mb-4 rounded-lg" />
        <Skeleton className="h-5 w-72 mx-auto rounded-lg" />
      </div>
      <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <div className="space-y-6">
          <Skeleton className="h-7 w-48 rounded" />
          <Skeleton className="h-16 w-full rounded" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-16 rounded" />
                <Skeleton className="h-5 w-40 rounded" />
              </div>
            </div>
          ))}
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-32 w-full rounded-md" />
          </div>
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>
  </section>
);
