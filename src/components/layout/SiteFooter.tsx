"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Instagram, MessageCircle, Phone, Mail } from 'lucide-react';
import { BrandIdentity } from '@/components/common/BrandIdentity';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';



export function SiteFooter({ showOnAdmin = false }: { showOnAdmin?: boolean }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute && pathname !== '/admin/login' && !showOnAdmin) return null;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-muted">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="py-12 flex flex-col items-center text-center">
          <div className="max-w-2xl">
            {/* Brand Section */}
            <div className="flex flex-col items-center">
              <Link href="/" className="mb-6 block hover:opacity-80 transition-opacity">
                <BrandIdentity size="xl" />
              </Link>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-light">
                Redefining electric luxury through cutting-edge engineering and uncompromising commitment to sustainable innovation.
              </p>
            </div>
          </div>
        </div>

        {/* Inspiration & Signature Section */}
        <div className="pb-10 border-t border-muted/10 pt-10 px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8 text-center md:text-left">
              {/* Left: Inspiration Label & Quote */}
              <div className="flex flex-col items-center md:items-start max-w-2xl">
                <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-primary/60 mb-4 md:mb-6">Inspiration</h3>
                <p className="text-xl md:text-2xl lg:text-3xl font-headline italic text-foreground leading-relaxed">
                  "The present is theirs; the future, for which I have really worked, is mine."
                </p>
              </div>
              
              {/* Right: Tilde & Signature */}
              <div className="flex justify-center md:justify-end items-center gap-4 md:gap-8 w-full md:w-auto">
                <span className="text-foreground/40 text-2xl md:text-3xl lg:text-4xl font-serif">~</span>
                <motion.svg
                  viewBox="0 0 267 49"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="text-foreground w-[160px] h-[30px] sm:w-[180px] sm:h-[34px] md:w-[200px] md:h-[38px]"
                >
                <g transform="translate(-4.5220961,1.1305238)">
                  <motion.path
                    d="M 37.699476,39.008732 C 37.699476,38.298246 39.744391,35.710746 42.243731,33.258732 C 47.030197,28.562899 54.699476,17.554852 54.699476,15.380464 C 54.699476,14.67612 52.258026,16.331187 49.274031,19.05839 C 43.245714,24.567932 27.405992,34.393183 20.315608,37.021064 C 16.718974,38.354071 15.459536,38.460584 14.51093,37.511978 C 12.845195,35.846243 14.24213,34.804427 20.018096,33.404808 C 27.269308,31.64771 46.09022,19.354267 55.304716,10.356295 C 57.731006,7.9870174 59.699476,7.6833796 59.699476,9.6783999 C 59.699476,12.09221 56.862608,17.953202 54.112065,21.222037 C 50.906861,25.031206 51.437156,26.004656 55.556886,23.87426 C 59.423936,21.874531 61.699476,21.869078 61.699476,23.859541 C 61.699476,24.717 61.239137,25.134053 60.6765,24.786324 C 58.880522,23.676348 47.3361,30.985934 43.399704,35.725479 C 39.581279,40.322984 37.699476,41.406877 37.699476,39.008732 z M 157.69947,39.046334 C 157.69947,37.635882 175.18156,19.560072 180.38187,15.593599 C 187.35622,10.27401 184.68939,14.653214 175.23336,24.047992 C 169.84049,29.405927 164.31078,35.254629 162.94512,37.045108 C 160.44428,40.323872 157.69947,41.371024 157.69947,39.046334 z M 249.69947,39.252975 C 246.67447,38.821052 241.83214,37.530055 238.93874,36.384092 C 233.02024,34.040004 229.45533,33.792469 224.83104,35.404502 C 220.62776,36.869776 216.69947,35.84416 216.69947,33.281472 C 216.69947,30.832904 215.99509,30.821864 209.98649,33.176259 C 199.3134,37.358378 196.06683,36.759896 200.94947,31.510349 L 203.19947,29.091271 L 199.19947,30.800354 C 196.99947,31.74035 193.67309,33.17016 191.80752,33.977709 C 189.94195,34.785259 186.59961,35.664869 184.38009,35.932399 C 182.16057,36.199928 179.91819,36.5047 179.39703,36.60967 C 177.13584,37.06511 177.86095,34.476811 180.15592,33.900811 C 181.55487,33.549696 182.69947,32.874389 182.69947,32.400129 C 182.69947,30.811877 189.05716,25.300524 190.88931,25.300524 C 193.12658,25.300524 193.31157,28.547634 191.1753,30.32058 C 188.15883,32.824027 190.5749,32.306798 198.26286,28.803282 C 207.20499,24.728221 210.04274,24.777376 206.76018,28.950472 C 205.61139,30.410929 204.85907,31.793456 205.08837,32.022755 C 205.6612,32.59559 215.83077,28.276051 217.77821,26.632727 C 218.64652,25.900015 219.70771,25.300524 220.13642,25.300524 C 220.56512,25.300524 223.7435,23.050524 227.19947,20.300524 C 233.73111,15.103139 235.69947,14.28401 235.69947,16.763263 C 235.69947,17.567769 233.11197,19.990298 229.94947,22.146661 C 222.98681,26.89418 218.69947,30.795448 218.69947,32.383617 C 218.69947,34.169673 225.25445,32.795735 228.34988,30.360871 C 231.60872,27.797466 234.04152,27.644367 233.28143,30.050524 C 232.81316,31.5329 234.14097,32.147959 241.96404,34.072411 C 247.04353,35.321949 252.86041,36.334449 254.89045,36.322411 C 258.84194,36.298979 260.83926,37.964494 258.57759,39.397015 C 257.81962,39.877101 256.74947,40.217786 256.19947,40.154094 C 255.64947,40.090401 252.72447,39.684898 249.69947,39.252975 z M 169.69947,36.300524 C 169.69947,35.750524 170.14947,35.300524 170.69947,35.300524 C 171.24947,35.300524 171.69947,35.750524 171.69947,36.300524 C 171.69947,36.850524 171.24947,37.300524 170.69947,37.300524 C 170.14947,37.300524 169.69947,36.850524 169.69947,36.300524 z M 123.17464,35.260353 C 122.77103,34.607296 120.3783,34.463821 116.7454,34.874838 C 109.95482,35.643104 108.90186,34.74361 111.25804,30.187256 C 112.89473,27.022246 112.89317,27.0169 110.54891,27.762156 C 109.25672,28.172953 106.62447,28.749035 104.69947,29.04234 C 102.77447,29.335644 100.61389,30.410242 99.898194,31.430335 C 99.182484,32.450428 97.643109,33.795507 96.477356,34.419399 C 94.782096,35.326675 94.128459,35.240098 93.212099,33.9869 C 92.256067,32.679449 91.36904,32.597058 87.854155,33.489231 C 84.343339,34.380371 83.343668,34.288497 81.850837,32.937503 C 80.269727,31.506619 79.83348,31.487775 78.129615,32.776757 C 77.068039,33.579845 75.861976,34.251229 75.449476,34.268721 C 73.634524,34.345683 75.091807,31.605248 80.449476,24.866165 C 83.611976,20.888252 87.129956,16.345376 88.267209,14.770887 C 90.043423,12.311776 90.427915,12.150465 90.994404,13.626712 C 91.440694,14.789725 90.529855,16.589393 88.176672,19.194085 C 83.796698,24.042192 83.762437,25.042765 88.06751,22.382083 C 91.782668,20.08599 92.699476,19.853108 92.699476,21.205502 C 92.699476,21.70324 90.727198,23.266312 88.316636,24.678995 C 83.871398,27.284078 82.018493,29.76162 83.72614,30.817003 C 85.496425,31.9111 91.709268,30.076056 95.478143,27.345897 C 98.173018,25.39374 99.810294,24.835718 101.22329,25.387812 C 102.31019,25.81249 104.19863,26.191582 105.41983,26.230239 C 109.05115,26.345187 118.50783,21.478741 120.87504,18.276929 C 123.38302,14.884702 124.69947,14.48295 124.69947,17.109799 C 124.69947,18.1049 122.22447,21.055833 119.19947,23.667428 C 113.39088,28.682204 111.98917,32.300524 115.85508,32.300524 C 117.04066,32.300524 119.54522,31.13008 121.42076,29.699537 C 124.92984,27.023027 126.96525,27.070427 124.71953,29.776358 C 123.69908,31.005917 123.70133,31.597837 124.73114,32.838686 C 126.28559,34.711682 132.69942,34.008973 139.98649,31.167285 C 145.6996,28.939382 145.69947,28.939395 145.69947,30.646388 C 145.69947,31.459472 142.76466,32.844996 138.28579,34.146388 C 130.27939,36.472743 124.20088,36.92084 123.17464,35.260353 z M 61.699476,31.250864 C 61.699476,30.673551 62.41277,28.821845 63.284574,27.135962 C 64.341306,25.092468 65.203006,24.404054 65.869672,25.07072 C 66.536339,25.737387 66.332746,27.109021 65.258894,29.185622 C 63.692852,32.214013 61.699476,33.370608 61.699476,31.250864 z M 74.867668,18.665692 C 75.065227,17.63985 75.670703,16.913024 76.213171,17.050524 C 77.666576,17.41892 77.412576,19.562824 75.853973,20.082358 C 74.97778,20.374423 74.633757,19.88029 74.867668,18.665692 z M 170.12807,11.185001 C 168.76257,8.9755649 171.67342,8.4392326 187.46134,7.9912971 C 202.76627,7.557065 206.47549,8.063976 204.06234,10.260028 C 202.64979,11.545494 170.88597,12.411305 170.12807,11.185001 z"
                    variants={{
                      hidden: { pathLength: 0, opacity: 0 },
                      visible: {
                        pathLength: 1,
                        opacity: 1,
                        transition: { duration: 3, ease: "easeInOut", delay: 0.5 }
                      }
                    }}
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                  <motion.path
                    d="M 132.41263,28.933199 C 131.80471,28.558718 131.26496,31.494019 132.55394,30.205038 C 133.06783,29.691146 132.81043,29.596203 132.41263,28.933199 z"
                    variants={{
                      hidden: { pathLength: 0, opacity: 0 },
                      visible: {
                        pathLength: 1,
                        opacity: 1,
                        transition: { duration: 1, ease: "easeInOut", delay: 3 }
                      }
                    }}
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                </g>
                <motion.path
                  d="M 183.21554,31.052931 C 182.68523,30.9387 182.5788,31.33474 183.00357,31.759509 C 183.30542,31.988991 183.99016,31.152122 183.21554,31.052931 z"
                  variants={{
                    hidden: { pathLength: 0, opacity: 0 },
                    visible: {
                      pathLength: 1,
                      opacity: 1,
                      transition: { duration: 1, ease: "easeInOut", delay: 3.2 }
                    }
                  }}
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
                <motion.path
                  d="M 93.61616,30.467415 C 93.245911,30.390555 93.171604,30.657028 93.468168,30.942831 C 93.678913,31.097236 94.156982,30.534155 93.61616,30.467415 z"
                  variants={{
                    hidden: { pathLength: 0, opacity: 0 },
                    visible: {
                      pathLength: 1,
                      opacity: 1,
                      transition: { duration: 1, ease: "easeInOut", delay: 3.4 }
                    }
                  }}
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </motion.svg>
              </div>
            </div>
          </div>
        </div>

        {/* Sub Footer */}
        <div className="py-6 px-6 md:px-12 border-t border-muted/20 bg-primary/5 rounded-2xl mb-2">
          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col gap-6">
            {/* Contact Section */}
            <div className="flex flex-col items-center gap-2 text-center">
              <h5 className="text-[11px] uppercase tracking-[0.3em] font-bold text-foreground">Contact Us</h5>
              <a href="tel:+919321111322" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2">
                <Phone size={16} className="text-primary" />
                <span>+91 93211 11322</span>
              </a>
            </div>

            <Separator className="opacity-20" />

            {/* Support Section */}
            <div className="flex flex-col items-center gap-2 text-center">
              <h5 className="text-[11px] uppercase tracking-[0.3em] font-bold text-foreground">Support</h5>
              <a href="mailto:shaikhandsons22@gmail.com" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2">
                <Mail size={16} className="text-primary" />
                <span>shaikhandsons22@gmail.com</span>
              </a>
            </div>

            <Separator className="opacity-20" />

            {/* Follow Us & Social */}
            <div className="flex flex-col items-center gap-4 text-center">
              <h5 className="text-[11px] uppercase tracking-[0.3em] font-bold text-foreground">Follow Us</h5>
              <div className="flex justify-center gap-3">
                <a href="#" className="w-8 h-8 flex items-center justify-center rounded border border-primary/30 text-muted-foreground hover:text-primary hover:bg-primary/10 hover:border-primary transition-all duration-300 text-xs" title="WhatsApp">
                  <MessageCircle size={16} />
                </a>
                <a href="#" className="w-8 h-8 flex items-center justify-center rounded border border-primary/30 text-muted-foreground hover:text-primary hover:bg-primary/10 hover:border-primary transition-all duration-300 text-xs" title="Instagram">
                  <Instagram size={16} />
                </a>
                <a href="#" className="w-8 h-8 flex items-center justify-center rounded border border-primary/30 text-muted-foreground hover:text-primary hover:bg-primary/10 hover:border-primary transition-all duration-300 text-xs" title="Phone">
                  <Phone size={16} />
                </a>
              </div>
              
              <div className="flex items-center justify-center gap-3 mt-2 text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">
                <Link href="/contact" className="hover:text-primary transition-colors duration-300">
                  Contact Us
                </Link>
                <span className="opacity-20">|</span>
                <Link href="/about" className="hover:text-primary transition-colors duration-300">
                  About Us
                </Link>
              </div>
            </div>
          </div>

          {/* Desktop Layout (Flexible Rows) */}
          <div className="hidden md:flex flex-col gap-y-6">
            {/* Row 1: Info & Socials */}
            <div className="flex justify-between items-center gap-12">
              {/* Left: Contact & Support */}
              <div className="flex gap-12 items-center">
                <div className="flex flex-col gap-1 min-w-[140px]">
                  <h5 className="text-[11px] uppercase tracking-[0.3em] font-bold text-foreground">Contact Us</h5>
                  <a href="tel:+919321111322" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2">
                    <Phone size={14} className="text-primary" />
                    <span>+91 93211 11322</span>
                  </a>
                </div>
                
                <div className="w-px h-8 bg-muted/20" />

                <div className="flex flex-col gap-1">
                  <h5 className="text-[11px] uppercase tracking-[0.3em] font-bold text-foreground">Support</h5>
                  <a href="mailto:shaikhandsons22@gmail.com" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2">
                    <Mail size={14} className="text-primary" />
                    <span>shaikhandsons22@gmail.com</span>
                  </a>
                </div>
              </div>

              {/* Right: Follow Us */}
              <div className="flex items-center gap-6">
                <h5 className="text-[11px] uppercase tracking-[0.3em] font-bold text-foreground">Follow Us</h5>
                <div className="flex gap-3">
                  <a href="#" className="w-8 h-8 flex items-center justify-center rounded border border-primary/30 text-muted-foreground hover:text-primary hover:bg-primary/10 hover:border-primary transition-all duration-300 text-xs" title="WhatsApp">
                    <MessageCircle size={16} />
                  </a>
                  <a href="#" className="w-8 h-8 flex items-center justify-center rounded border border-primary/30 text-muted-foreground hover:text-primary hover:bg-primary/10 hover:border-primary transition-all duration-300 text-xs" title="Instagram">
                    <Instagram size={16} />
                  </a>
                  <a href="#" className="w-8 h-8 flex items-center justify-center rounded border border-primary/30 text-muted-foreground hover:text-primary hover:bg-primary/10 hover:border-primary transition-all duration-300 text-xs" title="Phone">
                    <Phone size={16} />
                  </a>
                </div>
              </div>
            </div>

            {/* Row 2: Metadata & Credits */}
            <div className="flex justify-between items-center gap-12 pt-2 border-t border-muted/5">
              {/* Left: Copyright & Policies */}
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground relative z-10">
                <span className="whitespace-nowrap shrink-0">© {currentYear} Shaikh and Sons. All rights reserved.</span>
                <div className="w-px h-3 bg-muted/20 shrink-0" />
                <Link href="/privacy" className="hover:text-primary transition-colors duration-300 whitespace-nowrap shrink-0">
                  Privacy Policy
                </Link>
                <div className="w-px h-3 bg-muted/20 shrink-0" />
                <Link href="/terms" className="hover:text-primary transition-colors duration-300 whitespace-nowrap shrink-0">
                  Terms
                </Link>
                <div className="w-px h-3 bg-muted/20 shrink-0" />
                <Link href="/contact" className="hover:text-primary transition-colors duration-300 whitespace-nowrap shrink-0">
                  Contact
                </Link>
                <div className="w-px h-3 bg-muted/20 shrink-0" />
                <Link href="/about" className="hover:text-primary transition-colors duration-300 whitespace-nowrap shrink-0">
                  About
                </Link>
              </div>

              {/* Right: Developer Credit */}
              <div className="text-muted-foreground text-[10px] md:text-[11px] font-medium uppercase tracking-[0.2em] flex items-center gap-1.5 shrink-0">
                <span className="leading-none">Developed by</span>
                <a 
                  href="https://hrishi-portfolio-two.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-foreground transition-all duration-300 font-headline normal-case text-base tracking-normal leading-none -translate-y-[0.5px] relative group inline-block"
                >
                  Hrishi Mehta
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full group-active:w-full"></span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Global Bottom Section (Mobile Only Copyright / Developer Credit) */}
        <div className="md:hidden pb-[calc(80px+env(safe-area-inset-bottom,0px))] space-y-4 text-center">
          {/* Mobile-only Copyright/Policies */}
          <div className="space-y-4">
            <p className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-medium">
              © {currentYear} Shaikh and Sons. All rights reserved.
            </p>
            
            <div className="flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">
              <Link href="/privacy" className="hover:text-primary transition-colors duration-300">
                Privacy Policy
              </Link>
              <span className="opacity-20">|</span>
              <Link href="/terms" className="hover:text-primary transition-colors duration-300">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Developer Credit (Mobile) */}
          <div className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.2em] flex flex-wrap justify-center items-center gap-1.5">
            <span className="leading-none">Developed by</span>
            <a 
              href="https://hrishi-portfolio-two.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-foreground transition-all duration-300 font-headline normal-case text-base tracking-normal leading-none -translate-y-[0.5px] relative group inline-block"
            >
              Hrishi Mehta
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full group-active:w-full"></span>
            </a>
          </div>
        </div>
      </div>
      
      
    </footer>

  );
}
