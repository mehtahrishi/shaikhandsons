"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { HeroSection } from '@/components/home/HeroSection';
import { VehicleShowroom } from '@/components/shop/VehicleShowroom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { VEHICLE_CATEGORIES, normalizeVehicleCategoryParam } from '@/lib/vehicle-categories';
import { VehicleCard } from '@/components/shop/VehicleCard';
import { ChevronRight, Award } from 'lucide-react';
import { getImageUrl } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const BikeIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 358.945 358.945" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path d="M307.633,172.984c-6.389,0-12.61,1.174-18.524,3.479l-2.822-4.597l33.765-4.5c0.456-0.063,11.241-1.459,12.688-9.508
        c2.558-14.259-27.574-37.293-92.126-70.442c-5.915-2.747-10.227-4.086-13.181-4.086c-3.524,0-4.857,1.892-5.338,3.005
        c-2.606,6.008,9.121,21.804,20.645,35.245c-12.677-6.737-33.339-15.783-52.885-15.783c-9.833,0-18.417,2.306-25.517,6.854
        c-5.626,3.591-12.784,13.06-21.344,28.138c-0.375-0.597-0.987-1.015-1.684-1.132l-50.752-8.983l-7.071-21.227
        c-0.282-0.864-1.009-1.486-1.907-1.672c-0.973-0.184-24.085-4.666-44.883-4.666c-22.902,0-35.218,5.338-36.62,15.853
        c-3.278,24.761,99.893,57.601,121.84,64.294c-5.134,11.463-9.206,21.227-11.334,26.469c-6.395-21.432-26.667-36.74-49.146-36.74
        c-28.286,0-51.314,23.031-51.314,51.332c0,28.288,23.028,51.299,51.314,51.299c22.638,0,42.763-15.084,49.164-36.756h121.27
        c0.823,0,1.615-0.414,2.078-1.099l37.308-54.812l1.999,3.255c-10.778,9.733-16.939,23.574-16.939,38.106
        c0,28.294,23.022,51.299,51.317,51.299s51.312-23.005,51.312-51.299C358.945,196.016,335.921,172.984,307.633,172.984z
         M292.639,132.17c0.985-1.36,2.9-2.054,5.717-2.054c1.934,0,4.257,0.324,6.917,0.981c20.903,15.165,23.089,22.71,22.536,25.875
        c-0.78,4.398-8.305,5.419-8.395,5.425l-16.213,2.165C297.557,155.669,288.466,138.072,292.639,132.17z M93.274,219.038
        c-0.459,0.589-1.198,0.942-1.96,0.942H54.924v13.859h34.735c0.834,0,1.625,0.414,2.083,1.135c0.469,0.696,0.556,1.598,0.21,2.359
        c-5.233,12.244-17.219,20.158-30.522,20.158c-18.306,0-33.194-14.892-33.194-33.176c0-18.32,14.889-33.201,33.194-33.201
        c15.574,0,28.85,10.617,32.33,25.797C93.938,217.669,93.76,218.443,93.274,219.038z M307.633,257.492
        c-18.297,0-33.183-14.892-33.183-33.182c0-8.972,3.531-17.391,9.968-23.695c0.559-0.553,1.321-0.841,2.108-0.703
        c0.708,0.091,1.387,0.523,1.789,1.172l14.352,23.322l7.302-4.491l-14.346-23.323c-0.384-0.637-0.48-1.435-0.228-2.161
        c0.258-0.721,0.834-1.285,1.555-1.525c3.482-1.189,7.08-1.802,10.688-1.802c18.291,0,33.183,14.893,33.183,33.201
        C340.81,242.601,325.917,257.492,307.633,257.492z" fill="currentColor" />
    </g>
  </svg>
);

const ScootyIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 464.457 464.457" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path d="M463.994,276.597c0.83-2.232,0.531-4.727-0.801-6.7c-12.385-18.357-32.975-29.317-55.084-29.317
        c-0.586,0-1.174,0.014-1.762,0.029v-8.667c0-4.204-3.008-7.807-7.145-8.558l-14.324-2.601l-14.793-59.729
        c-0.551-2.214-1.945-4.124-3.891-5.318l-5.086-3.126c0.77-0.502,1.521-1.028,2.24-1.601c2.072-1.65,3.279-4.154,3.279-6.804
        v-30.707c0-0.554-0.053-1.104-0.158-1.648l-0.771-4.001c-0.412-2.13-1.604-4.031-3.344-5.327
        c-6.635-4.942-15.295-6.933-23.434-5.361c-8.01,1.545-14.65,6.188-18.926,12.443l-42.016,4.474
        c-7.164,0.763-12.354,7.189-11.592,14.354c0.715,6.695,6.373,11.666,12.959,11.666c0.459,0,0.928-0.024,1.396-0.075l35.552-3.785
        c1.256,4.203,3.4,7.985,6.197,11.152c0.014,0.03,0.021,0.061,0.033,0.091c10.322,23.743,33.264,91.222,15.729,117.964
        c-5.004,7.634-13.285,11.343-25.318,11.343h-48.647c-13.961,0-26.21-6.247-31.967-16.303c-6.205-10.835-4.744-25.234,4.195-41.802
        c2.625-1.497,4.394-4.322,4.394-7.56v-44.355c0-4.804-3.894-8.697-8.698-8.697H82.187c-4.803,0-8.697,3.894-8.697,8.697v37.693
        c-17.688,6.46-49.748,25.028-72.758,77.533C0.249,283.093,0,284.28,0,285.482v16.821c0,4.804,3.894,8.698,8.697,8.698H21.81
        c1.148,31.574,27.09,56.823,58.945,56.823c31.854,0,57.797-25.249,58.941-56.823h204.503c1.146,31.574,27.09,56.823,58.943,56.823
        c32.584,0,58.998-26.414,58.998-58.998c0-9.643-2.328-18.733-6.428-26.771l3.305-0.904
        C461.314,280.525,463.168,278.829,463.994,276.597z M102.228,227.229h37.333c2.763,0,5,2.239,5,5s-2.237,5-5,5h-37.333
        c-2.762,0-5-2.239-5-5S99.466,227.229,102.228,227.229z M80.755,331.706c-11.881,0-21.674-9.104-22.771-20.702h45.541
        C102.426,322.601,92.636,331.706,80.755,331.706z M139.561,273.563h-37.333c-2.762,0-5-2.238-5-5c0-2.761,2.238-5,5-5h37.333
        c2.763,0,5,2.239,5,5C144.561,271.325,142.324,273.563,139.561,273.563z M156.395,255.396h-71c-2.762,0-5-2.239-5-5s2.238-5,5-5h71
        c2.762,0,5,2.239,5,5S159.157,255.396,156.395,255.396z M403.145,331.706c-12.615,0-22.877-10.263-22.877-22.877
        c0-2.214,0.322-4.353,0.91-6.377l37.611-10.291c4.445,4.177,7.23,10.102,7.23,16.668
        C426.021,321.443,415.758,331.706,403.145,331.706z" fill="currentColor" />
    </g>
  </svg>
);

const DirtBikeIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 50 50" 
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M28 9C27.640625 8.996094 27.304688 9.183594 27.121094 9.496094C26.941406 9.808594 26.941406 10.191406 27.121094 10.503906C27.304688 10.816406 27.640625 11.003906 28 11L30.339844 11C30.367188 11.066406 30.699219 11.847656 30.761719 12L29.453125 12C28.320313 12 27.210938 12.308594 26.238281 12.890625L22.722656 15L6 15C5.640625 14.996094 5.304688 15.183594 5.121094 15.496094C4.941406 15.808594 4.941406 16.191406 5.121094 16.503906C5.304688 16.816406 5.640625 17.003906 6 17L9.667969 17L10.859375 18.785156L17 21L19.578125 20.761719L16.761719 25.503906L16.1875 25.761719C16.171875 25.734375 16.160156 25.703125 16.144531 25.675781L15.832031 25.863281C15.636719 25.539063 15.421875 25.222656 15.179688 24.929688L15.453125 24.703125C14.949219 24.089844 14.359375 23.550781 13.699219 23.101563L13.5 23.394531C13.1875 23.179688 12.855469 22.992188 12.511719 22.824219L12.671875 22.5C11.953125 22.152344 11.191406 21.90625 10.40625 21.769531L10.347656 22.125C9.976563 22.058594 9.597656 22.019531 9.210938 22.011719L9.21875 21.652344C8.429688 21.632813 7.636719 21.726563 6.863281 21.929688L6.953125 22.277344C6.585938 22.375 6.222656 22.492188 5.875 22.640625L5.734375 22.3125C5 22.625 4.3125 23.039063 3.695313 23.546875L3.925781 23.824219C3.632813 24.066406 3.359375 24.335938 3.101563 24.613281L2.832031 24.371094C2.296875 24.957031 1.847656 25.617188 1.496094 26.332031L1.820313 26.496094C1.65625 26.832031 1.507813 27.183594 1.390625 27.546875L1.050781 27.4375C0.804688 28.199219 0.671875 28.988281 0.648438 29.78125L1.007813 29.792969C1.007813 29.863281 1 29.929688 1 30C1 30.316406 1.023438 30.625 1.058594 30.933594L0.703125 30.972656C0.75 31.363281 0.824219 31.753906 0.925781 32.136719C1.027344 32.523438 1.160156 32.90625 1.3125 33.269531L1.640625 33.128906C1.792969 33.484375 1.972656 33.816406 2.171875 34.140625L1.859375 34.332031C2.269531 35.011719 2.777344 35.632813 3.367188 36.171875L3.617188 35.898438C3.898438 36.152344 4.191406 36.394531 4.507813 36.609375L4.304688 36.90625C4.964844 37.355469 5.679688 37.707031 6.4375 37.949219L6.546875 37.609375C6.90625 37.726563 7.277344 37.8125 7.65625 37.878906L7.59375 38.234375C8.382813 38.367188 9.183594 38.390625 9.976563 38.296875L9.929688 37.941406C10.3125 37.898438 10.6875 37.820313 11.050781 37.722656L11.140625 38.074219C11.914063 37.867188 12.652344 37.554688 13.328125 37.140625L13.140625 36.828125C13.46875 36.632813 13.785156 36.417969 14.078125 36.171875L14.304688 36.453125C14.917969 35.945313 15.457031 35.355469 15.90625 34.691406L15.609375 34.496094C15.824219 34.179688 16.007813 33.847656 16.175781 33.503906L16.503906 33.660156C16.855469 32.945313 17.097656 32.183594 17.234375 31.402344L16.878906 31.339844C16.941406 30.96875 16.980469 30.589844 16.988281 30.203125L17.347656 30.214844C17.355469 29.972656 17.328125 29.730469 17.3125 29.488281L20 29L25 31L26 31C27.65625 31 29 29.65625 29 28L29 23.964844C28.789063 23.984375 28.570313 24 28.34375 24C26.515625 24 25.003906 23.414063 24 22.890625L24 26L19.472656 24.859375L21.792969 20.953125C21.867188 20.828125 21.914063 20.6875 21.933594 20.542969L24 20.347656C24 20.347656 25.609375 22 28.34375 22C28.679688 22 28.984375 21.957031 29.265625 21.886719C29.953125 21.570313 31.851563 20.527344 33.363281 18.140625C33.542969 18.554688 33.542969 18.558594 33.726563 18.992188C34.417969 20.613281 35.058594 22.113281 35.6875 23.574219C35.332031 23.863281 34.996094 24.175781 34.691406 24.523438L34.96875 24.765625C34.71875 25.050781 34.492188 25.355469 34.28125 25.671875L33.980469 25.480469C33.546875 26.148438 33.214844 26.875 32.988281 27.640625L33.332031 27.738281C33.226563 28.101563 33.148438 28.476563 33.09375 28.859375L32.734375 28.804688C32.621094 29.59375 32.617188 30.394531 32.730469 31.183594L33.089844 31.128906C33.144531 31.511719 33.222656 31.882813 33.328125 32.246094L32.984375 32.347656C33.207031 33.109375 33.539063 33.835938 33.96875 34.507813L34.277344 34.3125C34.480469 34.632813 34.710938 34.9375 34.957031 35.222656L34.683594 35.464844C35.203125 36.070313 35.808594 36.59375 36.480469 37.027344L36.675781 36.71875C36.996094 36.921875 37.328125 37.105469 37.675781 37.265625L37.527344 37.59375C38.25 37.925781 39.015625 38.152344 39.804688 38.265625L39.859375 37.90625C40.230469 37.960938 40.605469 38 40.992188 38L40.992188 38.355469C41.792969 38.355469 42.582031 38.242188 43.347656 38.015625L43.246094 37.671875C43.613281 37.5625 43.972656 37.429688 44.316406 37.269531L44.46875 37.597656C44.824219 37.433594 45.171875 37.246094 45.503906 37.03125C45.839844 36.816406 46.164063 36.574219 46.464844 36.3125L46.226563 36.039063C46.515625 35.789063 46.785156 35.519531 47.03125 35.234375L47.308594 35.472656C47.832031 34.871094 48.261719 34.199219 48.59375 33.46875L48.265625 33.324219C48.425781 32.976563 48.5625 32.621094 48.671875 32.253906L49.011719 32.355469C49.234375 31.589844 49.347656 30.800781 49.347656 30.003906L49 30.003906C49 30.003906 49 30 49 30C49 29.613281 48.964844 29.238281 48.910156 28.863281L49.265625 28.8125C49.152344 28.027344 48.925781 27.257813 48.59375 26.53125L48.265625 26.683594C48.109375 26.335938 47.925781 26 47.71875 25.683594L48.023438 25.484375C47.589844 24.8125 47.066406 24.210938 46.46875 23.6875L46.230469 23.964844C45.941406 23.714844 45.640625 23.484375 45.316406 23.277344L45.511719 22.972656C44.839844 22.542969 44.113281 22.214844 43.347656 21.988281L43.25 22.328125C42.886719 22.222656 42.515625 22.144531 42.136719 22.089844L42.1875 21.734375C41.394531 21.621094 40.59375 21.621094 39.808594 21.734375L39.859375 22.089844C39.476563 22.144531 39.105469 22.222656 38.742188 22.328125L38.640625 21.988281C38.210938 22.113281 37.796875 22.285156 37.390625 22.480469C36.800781 21.097656 36.210938 19.722656 35.566406 18.207031C35.519531 18.101563 35.523438 18.105469 35.480469 18L41 18C41.359375 18.003906 41.695313 17.816406 41.878906 17.503906C42.058594 17.191406 42.058594 16.808594 41.878906 16.496094C41.695313 16.183594 41.359375 15.996094 41 16L34.628906 16C33.359375 13.007813 31.921875 9.609375 31.921875 9.609375C31.765625 9.242188 31.402344 9 31 9 Z M 9 24C11.117188 24 12.964844 25.085938 14.03125 26.734375L10.25 28.4375C9.894531 28.15625 9.453125 28 9 28C7.894531 28 7 28.894531 7 30C7 31.105469 7.894531 32 9 32C9.851563 32 10.609375 31.460938 10.886719 30.65625L14.996094 29.910156C14.996094 29.941406 15 29.96875 15 30C15 33.324219 12.324219 36 9 36C5.675781 36 3 33.324219 3 30C3 26.675781 5.675781 24 9 24 Z M 41 24C44.324219 24 47 26.675781 47 30C47 33.324219 44.324219 36 41 36C37.675781 36 35 33.324219 35 30C35 28.382813 35.636719 26.925781 36.667969 25.847656C37.203125 27.09375 37.703125 28.257813 37.882813 28.613281C38.179688 29.210938 38.585938 29.65625 39 30C39 31.105469 39.894531 32 41 32C42.105469 32 43 31.105469 43 30C43 28.894531 42.105469 28 41 28C40.671875 28 40.347656 28.082031 40.058594 28.234375C39.90625 28.082031 39.769531 27.914063 39.671875 27.71875C39.578125 27.53125 38.996094 26.207031 38.316406 24.636719C39.125 24.230469 40.03125 24 41 24Z"/>
  </svg>
);

const LoaderScooterIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 64 64"
    className={className}
    fill="currentColor"
    style={{ fillRule: "evenodd", clipRule: "evenodd", strokeLinejoin: "round", strokeMiterlimit: 2 }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="matrix(1,0,0,1,-352,-326)">
      <g id="bike" transform="matrix(1,0,0,1,18.8303,326)">
        <rect height="64" style={{ fill: "none" }} width="64" x="333.17" y="0" />
        <g transform="matrix(1,0,0,1,269.17,-192)">
          <path d="M103.754,214L102.523,210L98,210C96.896,210 96,209.104 96,208C96,206.896 96.896,206 98,206L104,206C104.878,206 105.653,206.573 105.912,207.412L107.939,214L112,214C113.104,214 114,214.896 114,216C114,217.104 113.104,218 112,218L109.169,218L111.634,226.008C111.755,226.003 111.877,226 112,226C116.415,226 120,229.585 120,234C120,238.415 116.415,242 112,242C107.585,242 104,238.415 104,234C104,231.12 105.525,228.594 107.811,227.185L106.609,223.278C102.69,225.254 100,229.315 100,234C100,234 100,234 100,234C100,235.105 99.105,236 98,236L87.748,236C86.858,239.449 83.725,242 80,242C75.585,242 72,238.415 72,234C72,230.275 74.551,227.142 78,226.252L78,224L76,224C75.47,224 74.961,223.789 74.586,223.414C74.211,223.039 74,222.53 74,222C74,221.47 74.211,220.961 74.586,220.586C74.961,220.211 75.47,220 76,220C79.685,220 87.172,220 87.172,220C87.172,220 91.076,216.095 92.586,214.586C92.961,214.211 93.47,214 94,214L103.754,214ZM112,230C114.208,230 116,231.792 116,234C116,236.208 114.208,238 112,238C109.792,238 108,236.208 108,234C108,231.792 109.792,230 112,230ZM80,230C82.208,230 84,231.792 84,234C84,236.208 82.208,238 80,238C77.792,238 76,236.208 76,234C76,231.792 77.792,230 80,230ZM104.984,218L94.828,218C94.828,218 90.924,221.905 89.414,223.414C89.039,223.789 88.53,224 88,224L82,224L82,226.252C84.81,226.977 87.023,229.191 87.748,232L96.124,232C96.826,226.381 100.447,221.663 105.419,219.414L104.984,218Z" />
        </g>
      </g>
    </g>
  </svg>
);

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  bikes: BikeIcon,
  scooty: ScootyIcon,
  'dirt-bike': DirtBikeIcon,
  'electric-loader': LoaderScooterIcon,
};

export default function Home() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = React.useState<string>('bikes');
  const [selectedBrandId, setSelectedBrandId] = React.useState<number | string | null>(null);
  const [brandGroups, setBrandGroups] = React.useState<any[]>([]);
  const [allBrands, setAllBrands] = React.useState<any[]>([]);
  const [activeBrandIndex, setActiveBrandIndex] = React.useState(0);

  useEffect(() => {
    const fetchBrandInventory = async () => {
      try {
        const [brandsRes, vehiclesRes] = await Promise.all([
          fetch('/api/brands'),
          fetch('/api/vehicles')
        ]);

        const brandsData = await brandsRes.json();
        const vehiclesData = await vehiclesRes.json();

        if (brandsRes.ok && vehiclesRes.ok) {
          const brands = brandsData.brands || [];
          const vehicles = vehiclesData.vehicles || [];

          setAllBrands(brands);

          const grouped = brands.map((brand: any) => ({
            ...brand,
            vehicles: vehicles.filter((v: any) => v.brandId === brand.id).slice(0, 4) // Show top 4 per brand
          })).filter((brand: any) => brand.vehicles.length > 0);

          setBrandGroups(grouped);
          if (grouped.length > 0) {
            setSelectedBrandId(grouped[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch brand inventory:', err);
      }
    };

    fetchBrandInventory();
  }, []);

  // Auto-cycle for Trusted Brands Carousel
  useEffect(() => {
    if (allBrands.length === 0) return;
    const interval = setInterval(() => {
      setActiveBrandIndex((prev) => (prev + 1) % allBrands.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [allBrands.length]);

  useEffect(() => {
    // Read type parameter safely on the client side
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const typeParam = params.get('type');
      if (typeParam) {
        setSelectedCategory(normalizeVehicleCategoryParam(typeParam));
      }
    }
  }, []);

  const categoriesList = VEHICLE_CATEGORIES.map((category) => ({
    id: category.id,
    name: category.label,
    icon: categoryIcons[category.id],
  }));

  useEffect(() => {
    if (!loading && user) {
      const isProfileIncomplete = !user.fullName || !user.phone || !user.address;

      if (isProfileIncomplete) {
        toast({
          title: "Complete Your Profile",
          description: "Please fill in your details to get the full experience.",
          action: (
            <Button variant="outline" size="sm" asChild>
              <Link href="/profile">Go to Profile</Link>
            </Button>
          ),
        });
      }
    }
  }, [user, loading, toast]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroSection />

      {/* Category Bar - Styled exactly like the user's high-end, premium screenshot and 100% dark/light theme friendly */}
      <nav className="bg-background border-b border-border z-40 relative">
        <div className="container mx-auto">
          <div className="flex items-center overflow-x-auto scrollbar-none justify-start md:justify-center">
            {categoriesList.map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`relative flex-1 py-4 md:py-5 px-6 md:px-10 flex items-center justify-center gap-3 font-body font-black uppercase text-[10px] tracking-[0.25em] transition-all whitespace-nowrap outline-none group hover:bg-muted/40 ${isActive
                    ? 'text-primary'
                    : 'text-foreground hover:text-primary'
                    }`}
                >
                  <Icon className={`w-5 h-5 md:w-6 md:h-6 transition-all duration-300 ${isActive ? 'text-primary scale-110' : 'text-foreground group-hover:text-primary'}`} />
                  <span>{tab.name}</span>

                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryLine"
                      className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Showroom */}
      <VehicleShowroom activeCategory={selectedCategory} />

      {/* From Top Brands Section - Redesigned with Premium Brand Navbar */}
      {brandGroups.length > 0 && (
        <section className="pb-8 md:pb-12 bg-muted/5 relative overflow-hidden">
          <div className="container mx-auto px-6 pt-6 md:pt-8">
            <div className="flex flex-col items-center text-center space-y-1 mb-4 md:mb-6">
              <h2 className="font-headline text-xl md:text-3xl font-black text-foreground uppercase tracking-tight">
                Shop By <span className="text-primary">Brand</span>
              </h2>
            </div>
          </div>

          <nav className="bg-background border-y border-border/50 z-40 relative">
            <div className="container mx-auto">
              <div className="flex items-center overflow-x-auto scrollbar-none justify-start md:justify-center">
                {brandGroups.map((group) => {
                  const isActive = selectedBrandId === group.id;
                  return (
                    <button
                      key={group.id}
                      onClick={() => setSelectedBrandId(group.id)}
                      className={`relative flex-1 py-4 md:py-5 px-6 md:px-12 flex items-center justify-center gap-3 font-body font-black uppercase text-[10px] tracking-[0.25em] transition-all whitespace-nowrap outline-none group hover:bg-muted/40 ${isActive
                        ? 'text-primary'
                        : 'text-foreground hover:text-primary'
                        }`}
                    >
                      {group.imageUrl ? (
                        <div className={`w-5 h-5 md:w-6 md:h-6 transition-all duration-300 ${isActive ? 'scale-110' : 'grayscale group-hover:grayscale-0 group-hover:scale-105'}`}>
                          <img src={getImageUrl(group.imageUrl)} alt={group.name} className="max-w-full max-h-full object-contain" />
                        </div>
                      ) : (
                        <span>{group.name}</span>
                      )}
                      <span className={group.imageUrl ? "hidden md:inline" : ""}>
                        {group.name} 
                        <span className="ml-1.5 text-[8px] opacity-60 font-bold">
                          ({group.vehicles.length} {group.vehicles.length === 1 ? 'Model' : 'Models'})
                        </span>
                      </span>

                      {isActive && (
                        <motion.div
                          layoutId="activeBrandLine"
                          className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary"
                          transition={{ type: "spring", stiffness: 350, damping: 28 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          <div className="container mx-auto px-6 pt-6 md:pt-8">
            <AnimatePresence mode="wait">
              {brandGroups.filter(g => g.id === selectedBrandId).map((group) => (
                <motion.div 
                  key={group.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-4 md:space-y-5"
                >
                  <Carousel
                    opts={{
                      align: "start",
                    }}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-4 md:-ml-6 pb-12">
                      {group.vehicles.map((vehicle: any) => (
                        <CarouselItem key={vehicle.id} className="pl-4 md:pl-6 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                          <div className="h-[420px] sm:h-[520px]">
                            <VehicleCard vehicle={vehicle} />
                          </div>
                        </CarouselItem>
                      ))}
                      
                      {/* Explore More Card in Carousel */}
                      <CarouselItem className="pl-4 md:pl-6 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                        <Link 
                          href={`/vehicles?brand=${group.id}`}
                          className="group relative h-[420px] sm:h-[520px] rounded-[2rem] overflow-hidden border border-dashed border-border/60 bg-muted/20 hover:bg-muted/30 transition-all duration-500 flex flex-col items-center justify-center text-center p-8 space-y-4"
                        >
                          <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:border-primary transition-all duration-500 shadow-sm">
                            <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-lg font-headline font-black uppercase tracking-tight">Explore More</h4>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              View All {group.name} Models
                            </p>
                          </div>

                        </Link>
                      </CarouselItem>
                    </CarouselContent>
                    
                    {/* Carousel Controls */}
                    <div className="flex justify-end gap-2 mt-6">
                      <CarouselPrevious className="static translate-y-0 h-10 w-10 border-border/50 bg-background/50 hover:bg-primary hover:text-primary-foreground transition-all" />
                      <CarouselNext className="static translate-y-0 h-10 w-10 border-border/50 bg-background/50 hover:bg-primary hover:text-primary-foreground transition-all" />
                    </div>
                  </Carousel>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* Our Trusted Brands Carousel - Focused Single View */}
      {allBrands.length > 0 && (
        <section className="py-10 md:py-16 border-t border-border/30 bg-background relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center text-center space-y-3 mb-8 md:mb-10">
              <div className="flex items-center gap-2 text-primary">
                <Award size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Strategic Partners</span>
              </div>
              <h2 className="font-headline text-3xl md:text-5xl font-black text-foreground uppercase tracking-tight">
                Our Industry <span className="text-primary">Leaders</span>
              </h2>
            </div>

            <div className="relative max-w-lg mx-auto">
              <div className="h-32 md:h-48 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={allBrands[activeBrandIndex]?.id}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.1, y: -10 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full flex flex-col items-center gap-6"
                  >
                    <Link href={`/vehicles?brand=${allBrands[activeBrandIndex]?.id}`}>
                      <div className="w-48 h-20 md:w-64 md:h-32 flex items-center justify-center cursor-pointer group">
                        {allBrands[activeBrandIndex]?.imageUrl ? (
                          <img 
                            src={getImageUrl(allBrands[activeBrandIndex].imageUrl)} 
                            alt={allBrands[activeBrandIndex].name} 
                            className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <span className="text-2xl font-headline font-black uppercase tracking-[0.2em] text-primary">
                            {allBrands[activeBrandIndex].name}
                          </span>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
