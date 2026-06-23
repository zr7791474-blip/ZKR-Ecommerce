'use client';

import Link from 'next/link';
import Image from 'next/image';

import {
  Mail,
  Lock,
  Truck,
  RotateCcw,
} from 'lucide-react';

import {
  SiX,
  SiWhatsapp,
  SiGithub,
} from 'react-icons/si';


const footerLinks = {
  shop: [
    { href: '/products', label: 'All Products' },
    { href: '/categories', label: 'Categories' },
    { href: '/products?featured=true', label: 'Featured' },
    { href: '/products?new=true', label: 'New Arrivals' },
    { href: '/products?sale=true', label: 'Sale' },
  ],

  company: [
    { href: '/about', label: 'About Us' },
    { href: '/careers', label: 'Careers' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ],

  support: [
    { href: '/help', label: 'Help Center' },
    { href: '/faq', label: 'FAQ' },
    { href: '/shipping', label: 'Shipping Info' },
    { href: '/returns', label: 'Returns' },
    { href: '/track-order', label: 'Track Order' },
  ],

  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/cookies', label: 'Cookie Policy' },
  ],
};



const socialLinks = [
  {
    label: 'X',
    href: 'https://x.com/zkr_ad',
    icon: SiX,
  },

  {
    label: 'WhatsApp',
    href: 'https://wa.me/212657516301',
    icon: SiWhatsapp,
  },

  {
    label: 'GitHub',
    href: 'https://github.com/zr7791474-blip',
    icon: SiGithub,
  },

  {
    label: 'Email',
    href:
      'mailto:zr7791474@gmail.com?subject=Project%20Inquiry&body=Hello%20Zakaria',
    icon: Mail,
  },
];



export function Footer() {

  return (

    <footer className="bg-muted/30 border-t border-border">

      <div className="container mx-auto px-4 py-12">


        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">


          {/* Brand */}

          <div className="col-span-2 md:col-span-1">


            <Link
              href="/"
              className="flex items-center space-x-2 mb-4"
            >

              <Image
                src="/logo.png"
                alt="ZKR"
                width={32}
                height={32}
                className="object-contain"
              />


              <span className="font-bold text-xl">
                ZKR
              </span>


            </Link>



            <p className="text-sm text-muted-foreground mb-4">
              Premium e-commerce platform for modern shoppers.
            </p>



            <div className="flex space-x-3">


              {socialLinks.map((social)=>{

                const Icon = social.icon;


                return (

                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="
                      w-9 h-9 rounded-lg
                      bg-background
                      border border-border
                      flex items-center justify-center
                      hover:bg-primary
                      hover:text-primary-foreground
                      hover:border-primary
                      transition-colors
                    "
                  >

                    <Icon className="w-4 h-4"/>

                  </a>

                );

              })}


            </div>


          </div>



          {/* Footer Columns */}


          {Object.entries(footerLinks).map(
            ([title, links]) => (

              <div key={title}>

                <h3 className="font-semibold mb-4 text-sm capitalize">
                  {title}
                </h3>


                <ul className="space-y-2">

                  {links.map((link)=>(

                    <li key={link.href}>

                      <Link
                        href={link.href}
                        className="
                          text-sm
                          text-muted-foreground
                          hover:text-foreground
                          transition-colors
                        "
                      >

                        {link.label}

                      </Link>

                    </li>

                  ))}


                </ul>


              </div>

            )
          )}



        </div>




        {/* Newsletter */}


        <div className="mt-12 pt-8 border-t border-border">


          <div className="
            flex
            flex-col
            md:flex-row
            items-center
            justify-between
            gap-4
          ">


            <div>

              <h3 className="font-semibold mb-1">
                Subscribe to our newsletter
              </h3>


              <p className="text-sm text-muted-foreground">
                Get updates on new products and exclusive offers.
              </p>


            </div>



            <form
              className="flex w-full md:w-auto gap-2"
              onSubmit={(e)=>e.preventDefault()}
            >

              <input
                type="email"
                placeholder="Enter your email"
                className="
                  flex-1
                  md:w-64
                  px-4
                  py-2
                  rounded-lg
                  bg-background
                  border
                  border-border
                "
              />


              <button
                type="submit"
                className="
                  px-6
                  py-2
                  rounded-lg
                  bg-primary
                  text-primary-foreground
                "
              >

                Subscribe

              </button>


            </form>


          </div>


        </div>




        {/* Bottom */}


        <div className="
          mt-8
          pt-8
          border-t
          border-border
          flex
          flex-col
          md:flex-row
          items-center
          justify-between
          gap-4
          text-sm
          text-muted-foreground
        ">


          <p>
            © 2026 ZKR. All rights reserved.
          </p>



          <div className="flex items-center gap-6">


            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4"/>
              Secure payments
            </span>


            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4"/>
              Fast shipping
            </span>


            <span className="flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4"/>
              Easy returns
            </span>


          </div>


        </div>



      </div>


    </footer>

  );

}