import { SanityCaseStudy } from "../../../types/sanity";
import { formatDate } from "../../../utils/date";
import { Button, Heading, Icon } from "../../atoms";
import { Image } from "../../molecules";


interface CaseStudyHeroProps extends SanityCaseStudy {}

const CaseStudyHero = (props: CaseStudyHeroProps) => {
  const { title, publishedAt, company, industries } = props;

  return (
    <section className="relative bg-background overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="relative pt-16 pb-12 lg:pt-24 lg:pb-20 md:pt-20 md:pb-16 sm:pt-16 sm:pb-12 xl:pt-32 xl:pb-24 2xl:pt-32 2xl:pb-24">
          {/* Back to case studies button - top left */}
          <div className="mb-8">
            <Button
              link="/work"
              mode="link"
              tone="primary"
               trailingIcon={{icon : "arrow-left" }}
              size="md"
            >
              Back to case studies
            </Button>
          </div>

          {/* Main content - centered */}
          <div className="flex flex-col items-center justify-center gap-6 relative w-full text-center">
            {/* Content */}
            <div className="flex flex-col items-center gap-6 w-full max-w-[800px]">
              {/* Industries/Tags */}
              {industries && industries.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {industries.map((industry) => (
                    <span 
                      key={industry._id}
                      className="text-sm font-semibold text-primary-link uppercase tracking-wide"
                    >
                      {industry.title}
                    </span>
                  )).reduce((prev, curr, index) => [
                    ...prev,
                    index > 0 && <span key={`sep-${index}`} className="text-primary-link">, </span>,
                    curr
                  ], [] as React.ReactNode[])}
                </div>
              )}
              
              {/* Main headline */}
              <Heading 
                as="h1" 
                size="5xl" 
                fontFamily="accent"
                textTransform="none"
                className="text-heading leading-tight"
              >
                {title}
              </Heading>

              {/* Company & Meta info */}
              <div className="flex flex-wrap gap-4 md:gap-8 items-center justify-center">
                {company && (
                  <div className="flex gap-3 items-center">
                    {company.logo && (
                      <div className="size-[40px] shrink-0 overflow-hidden rounded-full bg-muted flex items-center justify-center">
                        <Image 
                          {...company.logo} 
                          objectCover 
                          className="size-full" 
                          unsetMaxWidth 
                          unsetRatio 
                          alt={company.name || 'Company logo'} 
                        />
                      </div>
                    )}
                    <span className="text-sm md:text-md text-body font-body">
                      {company.name}
                    </span>
                  </div>
                )}
                {publishedAt && (
                  <div className="flex gap-2 items-center">
                    <Icon icon="calendar" size={20} className="text-body" />
                    <span className="text-sm md:text-md text-body font-body">{formatDate(publishedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudyHero;
