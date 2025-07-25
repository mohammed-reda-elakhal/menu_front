import React from 'react';
import { useParams } from 'react-router-dom';
import { templateService } from '../../services/templateService';

const demoMenuData = {
  business: {
    nom: "Ice Coffe",
    description: "Where every cup is a journey to bliss. At Brewed Bliss, we specialize in premium, ethically-sourced coffee that delivers rich flavors, smooth finishes, and the perfect pick-me-up. Brew your perfect moment with us!",
    logo: {
      url: "https://res.cloudinary.com/dgkwdiga4/image/upload/v1748270029/category_images/oveog5nwjx0lfcvjihmx.jpg",
      publicId: "category_images/oveog5nwjx0lfcvjihmx"
    },
    bio: "bio description of business ",
    socialMedia: {
      tiktok: "https://www.tiktok.com",
      snapchat: "https://www.snapchat.com",
      pinterest: "https://www.pinterest.com",
      linkedin: "https://www.instagram.com",
      instagram: "https://www.instagram.com",
      facebook: "https://www.facebook.com",
      whatsapp: "+212690137708",
      telegram: "+212690137708"
    },
    ville: "Rabat",
    adress: "Rabat ville , a cote de la garre",
    tele: "0690137708",
    person: "67f037d82f246b14a8a16c1a",
    createdAt: "2025-04-04T21:22:20.168Z",
    updatedAt: "2025-04-22T18:35:01.154Z",
    __v: 0
  },
  socialMediaVisible: true,
  active: true,
  code_menu: "menu_2025040903_c89c2d57",
  createdAt: "2025-04-09T02:03:57.644Z",
  updatedAt: "2025-04-09T03:50:21.818Z",
  __v: 0,
  template: null,
  categories: [
    {
      _id: "67f5d91092c172e3486d12c6",
      nom: "Boissons Chaude",
      description: "best boissons chaude with best quality",
      image: {
        url: "https://res.cloudinary.com/dgkwdiga4/image/upload/v1745349309/profile_photos/sbntlvtfrftacr7e1cpg.jpg",
        publicId: "profile_photos/sbntlvtfrftacr7e1cpg"
      },
      menu: "67f5d58d9950f2e5d0a8d9d4",
      createdAt: "2025-04-09T02:18:56.363Z",
      updatedAt: "2025-04-22T19:15:08.528Z",
      __v: 0,
      produits: [
        {
          _id: "6807f7382921a8dfcc622da4",
          nom: "Normal",
          description: "Caffee Normal",
          prix: 14,
          image: {
            url: "https://res.cloudinary.com/dgkwdiga4/image/upload/v1745352505/profile_photos/mzvsnfr7u6p8fipx4dw3.jpg",
            publicId: "profile_photos/mzvsnfr7u6p8fipx4dw3"
          },
          visible: true,
          review: 0,
          categorie: "67f5d91092c172e3486d12c6",
          createdAt: "2025-04-22T20:08:24.816Z",
          updatedAt: "2025-04-22T20:08:24.816Z",
          __v: 0
        },
        {
          _id: "6807f77a2921a8dfcc622dab",
          nom: "Caffee Créme",
          description: "Caffe Créme",
          prix: 16,
          image: {
            url: "https://res.cloudinary.com/dgkwdiga4/image/upload/v1745352570/profile_photos/wvzwfv9blg1cm4c1kddu.jpg",
            publicId: "profile_photos/wvzwfv9blg1cm4c1kddu"
          },
          visible: true,
          review: 0,
          categorie: "67f5d91092c172e3486d12c6",
          createdAt: "2025-04-22T20:09:30.145Z",
          updatedAt: "2025-04-22T20:09:30.145Z",
          __v: 0
        },
        {
          _id: "6807f7cf2921a8dfcc622db2",
          nom: "Cappocino",
          description: "Cappocino Caffee",
          prix: 16,
          image: {
            url: "https://res.cloudinary.com/dgkwdiga4/image/upload/v1745352656/profile_photos/iublfswp7bxqgddz9h80.jpg",
            publicId: "profile_photos/iublfswp7bxqgddz9h80"
          },
          visible: true,
          review: 0,
          categorie: "67f5d91092c172e3486d12c6",
          createdAt: "2025-04-22T20:10:55.205Z",
          updatedAt: "2025-04-22T20:10:55.205Z",
          __v: 0
        },
        {
          _id: "6807f8c32921a8dfcc622dd1",
          nom: "Chocolat Cho",
          description: "Chocolat",
          prix: 16,
          image: {
            url: "https://res.cloudinary.com/dgkwdiga4/image/upload/v1745352900/profile_photos/v6dqi7oeyyp6dmp9bks5.jpg",
            publicId: "profile_photos/v6dqi7oeyyp6dmp9bks5"
          },
          visible: true,
          review: 0,
          categorie: "67f5d91092c172e3486d12c6",
          createdAt: "2025-04-22T20:14:59.311Z",
          updatedAt: "2025-04-22T20:14:59.311Z",
          __v: 0
        }
      ],
      supplementaires: [
       
        {
          _id: "67f5e577187aaa92f43800d1",
          nom: "eau",
          description: "best product",
          prix: 5,
          image: {
            url: "https://res.cloudinary.com/dgkwdiga4/image/upload/v1744168313/profile_photos/n2p8pvnpf9l1cjba9hmn.jpg",
            publicId: "profile_photos/n2p8pvnpf9l1cjba9hmn"
          },
          visible: true,
          categorie: "67f5d91092c172e3486d12c6",
          createdAt: "2025-04-09T03:11:51.284Z",
          updatedAt: "2025-04-09T03:11:51.284Z",
          __v: 0
        }
      ]
    },
    {
      _id: "67f5d96392c172e3486d12c8",
      nom: "Jus",
      description: "Groupe of best just in this year",
      image: {
        url: "https://res.cloudinary.com/dgkwdiga4/image/upload/v1745349740/profile_photos/ihkmr2ffn7klqgctmui8.jpg",
        publicId: "profile_photos/ihkmr2ffn7klqgctmui8"
      },
      menu: "67f5d58d9950f2e5d0a8d9d4",
      createdAt: "2025-04-09T02:20:19.789Z",
      updatedAt: "2025-04-22T19:22:19.142Z",
      __v: 0,
      produits: [
        {
          _id: "67f5e2681990c87b86c83c82",
          nom: "Avocat",
          description: "best jus",
          prix: 16,
          image: {
            url: "https://res.cloudinary.com/dgkwdiga4/image/upload/v1745353013/profile_photos/aazfamqym4qtuvbuhmxw.jpg",
            publicId: "profile_photos/aazfamqym4qtuvbuhmxw"
          },
          visible: true,
          review: 0,
          categorie: "67f5d96392c172e3486d12c8",
          createdAt: "2025-04-09T02:58:48.039Z",
          updatedAt: "2025-04-22T20:16:53.113Z",
          __v: 0
        },
        {
          _id: "67f5e2731990c87b86c83c85",
          nom: "Fraise",
          description: "best jus",
          prix: 20,
          image: {
            url: "https://res.cloudinary.com/dgkwdiga4/image/upload/v1745352983/profile_photos/jiqmo7ha6qqly0izcppu.jpg",
            publicId: "profile_photos/jiqmo7ha6qqly0izcppu"
          },
          visible: true,
          review: 0,
          categorie: "67f5d96392c172e3486d12c8",
          createdAt: "2025-04-09T02:58:59.829Z",
          updatedAt: "2025-04-22T20:16:22.704Z",
          __v: 0
        },
        {
          _id: "6807f9b12921a8dfcc622e1a",
          nom: "Jus Dragon",
          description: "Jus Dragon",
          prix: 30,
          image: {
            url: "https://res.cloudinary.com/dgkwdiga4/image/upload/v1745353138/profile_photos/kymmakzlo5cufi5zkpnw.jpg",
            publicId: "profile_photos/kymmakzlo5cufi5zkpnw"
          },
          visible: true,
          review: 0,
          categorie: "67f5d96392c172e3486d12c8",
          createdAt: "2025-04-22T20:18:57.681Z",
          updatedAt: "2025-04-22T20:18:57.681Z",
          __v: 0
        },
        {
          _id: "6807f9de2921a8dfcc622e33",
          nom: "Jus Mong",
          description: "Jus Mong",
          prix: 20,
          promo_prix: null,
          composant: [],
          image: {
            url: "https://res.cloudinary.com/dgkwdiga4/image/upload/v1745353183/profile_photos/tpydmfcxxvfuttpcxk4u.jpg",
            publicId: "profile_photos/tpydmfcxxvfuttpcxk4u"
          },
          visible: true,
          review: 0,
          categorie: "67f5d96392c172e3486d12c8",
          createdAt: "2025-04-22T20:19:42.880Z",
          updatedAt: "2025-04-22T20:19:42.880Z",
          __v: 0
        },
        {
          _id: "6807fa182921a8dfcc622e3a",
          nom: "Jus Tomat",
          description: "Jus Tomat",
          prix: 18,
          promo_prix: null,
          composant: [],
          image: {
            url: "https://res.cloudinary.com/dgkwdiga4/image/upload/v1745353241/profile_photos/l8025glpdm35hmtvpk4a.jpg",
            publicId: "profile_photos/l8025glpdm35hmtvpk4a"
          },
          visible: true,
          review: 0,
          categorie: "67f5d96392c172e3486d12c8",
          createdAt: "2025-04-22T20:20:40.443Z",
          updatedAt: "2025-04-22T20:20:40.443Z",
          __v: 0
        }
      ],
      supplementaires: []
    },
    {
      _id: "67f5da0892c172e3486d12ca",
      nom: "Soda",
      description: "Groupe of best cold boissons in this year",
      image: {
        url: "https://res.cloudinary.com/dgkwdiga4/image/upload/v1745350250/profile_photos/kpxurediupraqkg4x8f0.jpg",
        publicId: "profile_photos/kpxurediupraqkg4x8f0"
      },
      menu: "67f5d58d9950f2e5d0a8d9d4",
      createdAt: "2025-04-09T02:23:04.550Z",
      updatedAt: "2025-04-22T19:30:49.763Z",
      __v: 0,
      produits: [
        {
          _id: "67f5e2a71990c87b86c83c88",
          nom: "Coca Cola",
          description: "best jus",
          prix: 20,
          composant: [""],
          image: {
            url: "https://res.cloudinary.com/dgkwdiga4/image/upload/v1745351789/profile_photos/p7iv2owa9mrjksjmu7a0.jpg",
            publicId: "profile_photos/p7iv2owa9mrjksjmu7a0"
          },
          visible: true,
          review: 0,
          categorie: "67f5da0892c172e3486d12ca",
          createdAt: "2025-04-09T02:59:51.826Z",
          updatedAt: "2025-04-22T19:56:28.879Z",
          __v: 0
        },
        {
          _id: "67f5e2bb1990c87b86c83c8b",
          nom: "Sprite",
          description: "best jus",
          prix: 20,
          composant: [],
          image: {
            url: "https://res.cloudinary.com/dgkwdiga4/image/upload/v1745352006/profile_photos/tzi7o9dytns46v1v4pgy.jpg",
            publicId: "profile_photos/tzi7o9dytns46v1v4pgy"
          },
          visible: true,
          review: 0,
          categorie: "67f5da0892c172e3486d12ca",
          createdAt: "2025-04-09T03:00:11.509Z",
          updatedAt: "2025-04-22T20:00:05.257Z",
          __v: 0
        },
        {
          _id: "6807f2fff06c0db089f19daa",
          nom: "monster",
          description: "Monster",
          prix: 22,
          promo_prix: null,
          composant: [],
          image: {
            url: "https://res.cloudinary.com/dgkwdiga4/image/upload/v1745351772/profile_photos/icwtqlrskw5pghoua0n8.jpg",
            publicId: "profile_photos/icwtqlrskw5pghoua0n8"
          },
          visible: true,
          review: 0,
          categorie: "67f5da0892c172e3486d12ca",
          createdAt: "2025-04-22T19:50:23.712Z",
          updatedAt: "2025-04-22T19:56:11.297Z",
          __v: 0
        },
        {
          _id: "6807f5ae2921a8dfcc622d3a",
          nom: "Red Bull",
          description: "Red Bull",
          prix: 30,
          promo_prix: null,
          composant: [],
          image: {
            url: "https://res.cloudinary.com/dgkwdiga4/image/upload/v1745352111/profile_photos/sfgw8wb2s3wgivabmdow.jpg",
            publicId: "profile_photos/sfgw8wb2s3wgivabmdow"
          },
          visible: true,
          review: 0,
          categorie: "67f5da0892c172e3486d12ca",
          createdAt: "2025-04-22T20:01:50.714Z",
          updatedAt: "2025-04-22T20:02:04.210Z",
          __v: 0
        },
        {
          _id: "6807f63c2921a8dfcc622d54",
          nom: "Sprite",
          description: "Sprite Soda",
          prix: 18,
          promo_prix: null,
          composant: [],
          image: {
            url: "https://res.cloudinary.com/dgkwdiga4/image/upload/v1745352253/profile_photos/vz6yrdf3j9jkqfjfxhki.jpg",
            publicId: "profile_photos/vz6yrdf3j9jkqfjfxhki"
          },
          visible: true,
          review: 0,
          categorie: "67f5da0892c172e3486d12ca",
          createdAt: "2025-04-22T20:04:12.739Z",
          updatedAt: "2025-04-22T20:04:12.739Z",
          __v: 0
        },
        {
          _id: "6807f6612921a8dfcc622d5b",
          nom: "Coca Cola Zero",
          description: "Soda Boissan",
          prix: 22,
          promo_prix: null,
          composant: [],
          image: {
            url: "https://res.cloudinary.com/dgkwdiga4/image/upload/v1745352290/profile_photos/bku1wl8xotvabp8cqf2b.jpg",
            publicId:"profile_photos/bku1wl8xotvabp8cqf2b"
          },
          visible: true,
          review: 0,
          categorie: "67f5da0892c172e3486d12ca",
          createdAt: "2025-04-22T20:04:49.354Z",
          updatedAt: "2025-04-22T20:04:49.354Z",
          __v: 0
        }
      ]
    }
  ]
};



/**
 * DemoTemplate component
 * 
 * This component renders a template demo based on the componentName parameter in the URL
 * or passed as a prop.
 */
const DemoTemplate = ({ componentName: propComponentName }) => {
  const params = useParams();
  const paramComponentName = params.componentName;
  
  // Use the component name from props or URL params
  const componentName = propComponentName || paramComponentName;

  console.log('DemoTemplate rendering with component name:', componentName);

  if (!componentName) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 text-gray-800">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Template Not Specified</h2>
          <p>Please provide a valid template component name in the URL or as a prop.</p>
        </div>
      </div>
    );
  }

  // Get the component directly from the template service
  const TemplateComponent = templateService.getTemplateComponent(componentName);

  return (
    <React.Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading template...</div>}>
      <TemplateComponent menuData={demoMenuData} />
    </React.Suspense>
  );
};

export default DemoTemplate;
