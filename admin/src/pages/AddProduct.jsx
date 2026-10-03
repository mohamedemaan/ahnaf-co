import React, { useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ==================================================
// ADVANCED 3-LEVEL CATEGORY SYSTEM & DYNAMIC FIELDS
// ==================================================
const CATEGORY_TREE = [
  {
    id: "cat_1",
    name: "Mobiles & Computers",
    subcategories: [
      {
        id: "sub_1", name: "Smartphones", types: ["Android Phones", "iOS Phones", "Feature Phones", "Gaming Phones", "Foldable Phones"],
        attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "color", label: "Color Variants", type: "text" }, { name: "ram", label: "RAM", type: "select", options: ["2GB", "4GB", "6GB", "8GB", "12GB", "16GB"] }, { name: "storage", label: "Storage", type: "select", options: ["64GB", "128GB", "256GB", "512GB", "1TB"] }, { name: "processor", label: "Processor", type: "text" }]
      },
      {
        id: "sub_2", name: "Laptops", types: ["Gaming Laptops", "Ultrabooks", "Business Laptops", "MacBooks", "Chromebooks", "2-in-1 Laptops"],
        attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "processor", label: "Processor", type: "text" }, { name: "ram", label: "RAM", type: "text" }, { name: "gpu", label: "Graphics", type: "text" }]
      },
      {
        id: "sub_3", name: "Tablets", types: ["iPads", "Android Tablets", "Windows Tablets", "E-Readers", "Drawing Tablets"],
        attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "screenSize", label: "Screen Size", type: "text" }, { name: "storage", label: "Storage", type: "text" }]
      },
      {
        id: "sub_4", name: "Wearables", types: ["Smartwatches", "Fitness Bands", "Smart Glasses", "Smart Rings", "VR Headsets"],
        attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "compatibility", label: "OS Compatibility", type: "text" }, { name: "batteryLife", label: "Battery Life", type: "text" }]
      },
      {
        id: "sub_5", name: "Audio", types: ["True Wireless Earbuds", "Wireless Headphones", "Wired Earphones", "Bluetooth Speakers", "Soundbars", "Home Theatre"],
        attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "connectivity", label: "Connectivity", type: "text" }, { name: "noiseCancellation", label: "ANC", type: "select", options: ["Yes", "No"] }]
      },
      {
        id: "sub_6", name: "PC Components", types: ["Processors", "Motherboards", "Graphics Cards", "RAM", "Power Supplies", "Coolers", "Cabinets"],
        attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "socketType", label: "Socket/Form Factor", type: "text" }]
      },
      {
        id: "sub_7", name: "Storage Devices", types: ["External HDDs", "External SSDs", "Internal HDDs", "Internal SSDs", "Pen Drives", "Memory Cards"],
        attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "capacity", label: "Capacity", type: "text" }, { name: "interface", label: "Interface", type: "text" }]
      },
      {
        id: "sub_8", name: "Networking", types: ["Routers", "Mesh Wi-Fi", "Modems", "Network Switches", "Wi-Fi Extenders", "Network Cards"],
        attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "speed", label: "Max Speed", type: "text" }, { name: "bands", label: "Frequency Bands", type: "text" }]
      },
      {
        id: "sub_9", name: "Monitors", types: ["Gaming Monitors", "Ultrawide Monitors", "4K Monitors", "Curved Monitors", "Portable Monitors"],
        attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "refreshRate", label: "Refresh Rate", type: "text" }, { name: "panelType", label: "Panel Type (IPS/VA/TN)", type: "text" }]
      },
      {
        id: "sub_10", name: "Printers", types: ["Laser Printers", "Inkjet Printers", "All-in-One Printers", "3D Printers", "Label Printers"],
        attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "color", label: "Color Output", type: "select", options: ["Monochrome", "Color"] }]
      }
    ]
  },
  {
    id: "cat_2",
    name: "Men's Fashion",
    subcategories: [
      { id: "sub_11", name: "Topwear", types: ["T-Shirts", "Casual Shirts", "Formal Shirts", "Jackets", "Sweatshirts", "Sweaters", "Hoodies", "Blazers", "Coats"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "size", label: "Size", type: "select", options: ["S", "M", "L", "XL", "XXL", "3XL"] }, { name: "color", label: "Color", type: "text" }, { name: "fabric", label: "Fabric", type: "text" }] },
      { id: "sub_12", name: "Bottomwear", types: ["Jeans", "Trousers", "Shorts", "Trackpants", "Cargos", "Chinos", "Joggers", "Formal Pants"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "waist", label: "Waist Size", type: "text" }, { name: "fit", label: "Fit", type: "text" }] },
      { id: "sub_13", name: "Footwear", types: ["Sneakers", "Sports Shoes", "Formal Shoes", "Sandals", "Flip Flops", "Boots", "Loafers", "Slippers", "Running Shoes"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "shoeSize", label: "Shoe Size", type: "text" }, { name: "material", label: "Material", type: "text" }] },
      { id: "sub_14", name: "Innerwear", types: ["Briefs", "Trunks", "Boxers", "Vests", "Thermal Wear"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "size", label: "Size", type: "text" }] },
      { id: "sub_15", name: "Accessories", types: ["Watches", "Belts", "Wallets", "Sunglasses", "Caps", "Ties", "Cufflinks", "Socks", "Scarves"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "material", label: "Material", type: "text" }] },
      { id: "sub_16", name: "Ethnic Wear", types: ["Kurtas", "Sherwanis", "Nehru Jackets", "Dhotis", "Pathani Suits"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "size", label: "Size", type: "text" }] },
      { id: "sub_17", name: "Activewear", types: ["Gym T-Shirts", "Tracksuits", "Sports Shorts", "Compression Wear"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "size", label: "Size", type: "text" }] },
      { id: "sub_18", name: "Bags & Luggage", types: ["Backpacks", "Laptop Bags", "Duffel Bags", "Suitcases", "Briefcases", "Messenger Bags"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "capacity", label: "Capacity (Liters)", type: "text" }] },
      { id: "sub_19", name: "Winter Wear", types: ["Leather Jackets", "Windcheaters", "Thermals", "Puffer Jackets"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "size", label: "Size", type: "text" }] },
      { id: "sub_20", name: "Personal Care", types: ["Trimmers", "Shavers", "Beard Oils", "Deodorants", "Perfumes"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] }
    ]
  },
  {
    id: "cat_3",
    name: "Women's Fashion",
    subcategories: [
      { id: "sub_21", name: "Western Wear", types: ["Dresses", "Tops", "Jeans", "Skirts", "Jumpsuits", "Sweaters", "Jackets", "Coats", "Blazers", "Trousers"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "size", label: "Size", type: "text" }, { name: "color", label: "Color", type: "text" }, { name: "fabric", label: "Fabric", type: "text" }] },
      { id: "sub_22", name: "Ethnic Wear", types: ["Sarees", "Kurtas", "Lehenga Cholis", "Dress Material", "Dupattas", "Palazzos", "Salwar Suits"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "size", label: "Size", type: "text" }, { name: "pattern", label: "Pattern", type: "text" }] },
      { id: "sub_23", name: "Footwear", types: ["Heels", "Flats", "Sneakers", "Boots", "Wedges", "Sandals", "Ballerinas", "Sports Shoes"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "shoeSize", label: "Shoe Size", type: "text" }] },
      { id: "sub_24", name: "Lingerie & Sleepwear", types: ["Bras", "Panties", "Nightdresses", "Shapewear", "Camisoles", "Robes"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "size", label: "Size", type: "text" }] },
      { id: "sub_25", name: "Bags, Wallets & Clutches", types: ["Handbags", "Sling Bags", "Tote Bags", "Clutches", "Wallets", "Backpacks"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "material", label: "Material", type: "text" }] },
      { id: "sub_26", name: "Jewellery", types: ["Necklaces", "Earrings", "Rings", "Bracelets", "Pendants", "Anklets", "Mangalsutras", "Nose Rings"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "material", label: "Metal/Material", type: "text" }] },
      { id: "sub_27", name: "Beauty & Makeup", types: ["Lipsticks", "Foundations", "Eye Makeup", "Nail Polish", "Skincare", "Haircare", "Fragrances", "Makeup Brushes"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "shade", label: "Shade/Color", type: "text" }, { name: "skinType", label: "Skin Type", type: "text" }] },
      { id: "sub_28", name: "Accessories", types: ["Watches", "Sunglasses", "Belts", "Hair Accessories", "Scarves", "Hats"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] },
      { id: "sub_29", name: "Activewear", types: ["Sports Bras", "Yoga Pants", "Tracksuits", "Gym T-Shirts", "Shorts"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "size", label: "Size", type: "text" }] },
      { id: "sub_30", name: "Maternity Wear", types: ["Maternity Dresses", "Nursing Bras", "Maternity Tops", "Maternity Bottoms"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "size", label: "Size", type: "text" }] }
    ]
  },
  {
    id: "cat_4",
    name: "Electronics & Appliances",
    subcategories: [
      { id: "sub_31", name: "Televisions", types: ["Smart TVs", "OLED TVs", "QLED TVs", "LED TVs", "Mini-LED TVs", "8K TVs"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "screenSize", label: "Screen Size", type: "text" }, { name: "resolution", label: "Resolution", type: "text" }] },
      { id: "sub_32", name: "Refrigerators", types: ["Single Door", "Double Door", "Side-by-Side", "French Door", "Mini Fridges"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "capacity", label: "Capacity (Liters)", type: "text" }, { name: "energyRating", label: "Energy Rating", type: "text" }] },
      { id: "sub_33", name: "Air Conditioners", types: ["Split ACs", "Window ACs", "Portable ACs", "Inverter ACs"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "capacity", label: "Capacity (Tons)", type: "text" }, { name: "energyRating", label: "Energy Rating", type: "text" }] },
      { id: "sub_34", name: "Washing Machines", types: ["Fully Automatic Top Load", "Fully Automatic Front Load", "Semi-Automatic", "Washer Dryers"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "capacity", label: "Capacity (Kg)", type: "text" }] },
      { id: "sub_35", name: "Kitchen Appliances", types: ["Microwave Ovens", "Mixer Grinders", "Juicers", "Induction Cooktops", "Air Fryers", "Water Purifiers", "Toasters", "Coffee Makers", "Electric Kettles", "Sandwich Makers"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "power", label: "Power Consumption (W)", type: "text" }] },
      { id: "sub_36", name: "Cameras", types: ["DSLRs", "Mirrorless Cameras", "Action Cameras", "Point & Shoot", "Security Cameras", "Drones", "Camera Lenses"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "resolution", label: "Megapixels", type: "text" }] },
      { id: "sub_37", name: "Personal Care Appliances", types: ["Hair Dryers", "Straighteners", "Epilators", "Electric Toothbrushes", "Massagers"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] },
      { id: "sub_38", name: "Home Appliances", types: ["Vacuum Cleaners", "Irons", "Fans", "Room Heaters", "Air Purifiers", "Water Heaters", "Sewing Machines", "Inverters"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] },
      { id: "sub_39", name: "Gaming", types: ["PlayStation Consoles", "Xbox Consoles", "Nintendo Consoles", "Gaming Accessories", "Game Discs", "VR Headsets", "Controllers"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] },
      { id: "sub_40", name: "Smart Home", types: ["Smart Speakers", "Smart Bulbs", "Smart Plugs", "Smart Locks", "Smart Cameras"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "ecosystem", label: "Ecosystem (Alexa/Google/HomeKit)", type: "text" }] }
    ]
  },
  {
    id: "cat_5",
    name: "Home, Kitchen & Furniture",
    subcategories: [
      { id: "sub_41", name: "Furniture", types: ["Beds", "Sofas", "Dining Tables", "Wardrobes", "Office Chairs", "Bookshelves", "TV Units", "Shoe Racks", "Recliners", "Coffee Tables", "Bean Bags"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "material", label: "Material", type: "text" }, { name: "dimensions", label: "Dimensions", type: "text" }] },
      { id: "sub_42", name: "Home Decor", types: ["Wall Art", "Clocks", "Vases", "Showpieces", "Candles", "Photo Frames", "Indoor Plants", "Mirrors", "Wind Chimes", "Figurines"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] },
      { id: "sub_43", name: "Kitchen Storage", types: ["Containers", "Jars", "Lunch Boxes", "Water Bottles", "Spice Racks", "Casseroles", "Thermos"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "material", label: "Material", type: "text" }] },
      { id: "sub_44", name: "Cookware", types: ["Pans", "Pots", "Pressure Cookers", "Tawas", "Kadhais", "Baking Tools", "Knives", "Choppers"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "inductionSafe", label: "Induction Safe", type: "select", options: ["Yes", "No"] }] },
      { id: "sub_45", name: "Tableware", types: ["Dinner Sets", "Plates", "Bowls", "Glasses", "Mugs", "Cutlery", "Trays", "Coasters"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "material", label: "Material", type: "text" }] },
      { id: "sub_46", name: "Bedding", types: ["Bedsheets", "Blankets", "Pillows", "Comforters", "Duvets", "Mattresses", "Mattress Protectors"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "size", label: "Size", type: "select", options: ["Single", "Double", "Queen", "King"] }] },
      { id: "sub_47", name: "Bath", types: ["Towels", "Bath Mats", "Shower Curtains", "Bathrobes", "Soap Dispensers", "Bathroom Accessories"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] },
      { id: "sub_48", name: "Lighting", types: ["Ceiling Lights", "Table Lamps", "Floor Lamps", "Wall Lights", "Fairy Lights", "LED Bulbs", "Chandeliers"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "power", label: "Wattage", type: "text" }] },
      { id: "sub_49", name: "Gardening", types: ["Pots & Planters", "Seeds", "Fertilizers", "Gardening Tools", "Watering Cans", "Pebbles"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] },
      { id: "sub_50", name: "Hardware & Tools", types: ["Power Tools", "Hand Tools", "Drilling Machines", "Tool Kits", "Measuring Tools", "Screwdrivers", "Ladders"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] }
    ]
  },
  {
    id: "cat_6",
    name: "Sports, Fitness & Outdoors",
    subcategories: [
      { id: "sub_51", name: "Cricket", types: ["Bats", "Balls", "Pads", "Gloves", "Helmets", "Kits", "Shoes", "Stumps"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] },
      { id: "sub_52", name: "Football", types: ["Footballs", "Studs", "Goalkeeper Gloves", "Shin Guards", "Jerseys", "Goal Nets"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] },
      { id: "sub_53", name: "Badminton", types: ["Rackets", "Shuttlecocks", "Nets", "Shoes", "Kit Bags", "Grips"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] },
      { id: "sub_54", name: "Cycling", types: ["Bicycles", "Helmets", "Lights", "Locks", "Pumps", "Gloves", "Jerseys", "Tires"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] },
      { id: "sub_55", name: "Fitness Equipment", types: ["Dumbbells", "Treadmills", "Exercise Bikes", "Resistance Bands", "Kettlebells", "Weight Plates", "Home Gyms", "Push-up Bars"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] },
      { id: "sub_56", name: "Yoga", types: ["Yoga Mats", "Yoga Blocks", "Yoga Straps", "Yoga Wheels", "Gym Balls"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] },
      { id: "sub_57", name: "Camping & Hiking", types: ["Tents", "Sleeping Bags", "Backpacks", "Trekking Poles", "Headlamps", "Camping Chairs", "Compasses"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] },
      { id: "sub_58", name: "Swimming", types: ["Swimsuits", "Goggles", "Swim Caps", "Kickboards", "Ear Plugs", "Fins"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] },
      { id: "sub_59", name: "Racket Sports", types: ["Tennis Rackets", "Table Tennis Bats", "Squash Rackets", "Balls", "Nets"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] },
      { id: "sub_60", name: "Running", types: ["Running Shoes", "Hydration Packs", "Running Shorts", "Running T-Shirts", "Reflective Gear"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] }
    ]
  },
  {
    id: "cat_7",
    name: "Toys, Baby & Kids",
    subcategories: [
      { id: "sub_61", name: "Toys", types: ["Action Figures", "Remote Control Cars", "Dolls", "Soft Toys", "Building Blocks", "Puzzles", "Educational Toys", "Musical Toys", "Outdoor Toys", "Slime"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "ageGroup", label: "Age Group", type: "text" }] },
      { id: "sub_62", name: "Baby Care", types: ["Diapers", "Baby Wipes", "Baby Lotions", "Baby Powders", "Baby Wash", "Baby Oil", "Rash Creams", "Thermometers"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] },
      { id: "sub_63", name: "Kids Clothing", types: ["T-Shirts", "Dresses", "Jeans", "Shorts", "Nightwear", "Rompers", "Sweaters", "Jackets", "Ethnic Wear", "Innerwear"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "age", label: "Age/Size", type: "text" }] },
      { id: "sub_64", name: "Kids Footwear", types: ["Sneakers", "School Shoes", "Sandals", "Boots", "Slippers", "Crocs", "Socks"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "shoeSize", label: "Shoe Size", type: "text" }] },
      { id: "sub_65", name: "Baby Gear", types: ["Strollers", "Car Seats", "Baby Carriers", "High Chairs", "Walkers", "Bouncers", "Cradles", "Playpens"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] },
      { id: "sub_66", name: "Nursery", types: ["Cots", "Baby Bedding", "Mosquito Nets", "Baby Blankets", "Nursery Decor", "Storage Baskets"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] },
      { id: "sub_67", name: "Feeding & Nursing", types: ["Feeding Bottles", "Breast Pumps", "Sterilizers", "Bibs", "Sippy Cups", "Baby Food", "Formula", "Nursing Pillows"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] },
      { id: "sub_68", name: "Maternity", types: ["Maternity Belts", "Pregnancy Pillows", "Stretch Mark Creams", "Breast Pads"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] },
      { id: "sub_69", name: "School Supplies", types: ["School Bags", "Lunch Boxes", "Water Bottles", "Pencil Boxes", "Stationery Sets", "Notebooks", "Geometry Boxes"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] },
      { id: "sub_70", name: "Board Games", types: ["Chess", "Monopoly", "Scrabble", "Ludo", "Snakes & Ladders", "Card Games", "Strategy Games"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] }
    ]
  },
  {
    id: "cat_8",
    name: "Automotive",
    subcategories: [
      { id: "sub_71", name: "Car Accessories", types: ["Car Covers", "Seat Covers", "Floor Mats", "Perfumes", "Sun Shades", "Mobile Holders", "Steering Covers", "Dashcams"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] },
      { id: "sub_72", name: "Bike Accessories", types: ["Bike Covers", "Helmets", "Riding Gloves", "Tank Bags", "Mobile Holders", "Saddle Bags", "Face Masks", "Bike Locks"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] },
      { id: "sub_73", name: "Car Electronics", types: ["Stereos", "Speakers", "Amplifiers", "Subwoofers", "Reverse Cameras", "GPS Navigators", "Chargers"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] },
      { id: "sub_74", name: "Vehicle Care", types: ["Car Wash Shampoos", "Wax & Polish", "Microfiber Cloths", "Tire Polish", "Scratch Removers", "Glass Cleaners", "Vacuum Cleaners"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] },
      { id: "sub_75", name: "Oils & Lubricants", types: ["Engine Oils", "Coolants", "Brake Fluids", "Chain Lubes", "Grease", "Additives"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "volume", label: "Volume (L/ml)", type: "text" }] },
      { id: "sub_76", name: "Spare Parts", types: ["Wiper Blades", "Air Filters", "Oil Filters", "Spark Plugs", "Brake Pads", "Bulbs", "Fuses", "Mirrors", "Batteries"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }, { name: "vehicleModel", label: "Compatible Vehicle", type: "text" }] },
      { id: "sub_77", name: "Tyres & Alloys", types: ["Car Tyres", "Bike Tyres", "Alloy Wheels", "Wheel Covers", "Puncture Kits", "Air Compressors", "Pressure Gauges"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] },
      { id: "sub_78", name: "Riding Gear", types: ["Riding Jackets", "Riding Pants", "Knee Guards", "Elbow Guards", "Riding Boots", "Balaclavas"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] },
      { id: "sub_79", name: "Safety & Security", types: ["GPS Trackers", "Gear Locks", "Steering Locks", "Alarms", "Jump Starters", "Tow Cables", "Fire Extinguishers"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] },
      { id: "sub_80", name: "Exterior Accessories", types: ["Bumper Guards", "Roof Rails", "Spoilers", "Mud Flaps", "Decals", "Antennas", "Chrome Accessories"], attributes: [{ name: "brand", label: "Brand", type: "text", required: true }] }
    ]
  }
];

export default function AddProduct({ token }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==================================================
  // CORE DATA STRUCTURE
  // ==================================================
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subcategory: "",
    productType: "",
    price: "",
    originalPrice: "",
    stock: "",
    sku: "",
    description: "",
    attributes: {} // Dynamic fields
  });

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);

  // Auto-generate SKU if none provided
  const generateSKU = () => {
    if (formData.sku) return formData.sku;
    const prefix = formData.category.substring(0, 3).toUpperCase();
    const sub = formData.subcategory.substring(0, 3).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${sub}-${random}`;
  };

  // Derive active dynamic attributes based on subcategory
  const activeAttributes = useMemo(() => {
    if (!formData.category || !formData.subcategory) return [];
    const mainCat = CATEGORY_TREE.find(c => c.name === formData.category);
    if (!mainCat) return [];
    const subCat = mainCat.subcategories.find(s => s.name === formData.subcategory);
    return subCat ? (subCat.attributes || []) : [];
  }, [formData.category, formData.subcategory]);

  // ==================================================
  // STEPPER & VALIDATION LOGIC
  // ==================================================
  const handleNext = () => {
    if (step === 1 && (!formData.category || !formData.subcategory)) {
      return alert("Please select a Main Category and Subcategory.");
    }
    if (step === 2) {
      if (!formData.title || !formData.price || !formData.stock) {
        return alert("Title, Price, and Stock are mandatory fields.");
      }
      // Check required dynamic fields (if any are deemed strict)
      const missingAttrs = activeAttributes.filter(attr => !formData.attributes[attr.name] && attr.required);
      if (missingAttrs.length > 0) {
        return alert(`Please fill out: ${missingAttrs.map(a => a.label).join(", ")}`);
      }
    }
    if (step === 3 && images.length === 0) {
      return alert("You must upload at least one product image.");
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      
      // Cascade resets for category hierarchy
      if (name === "category") {
        newData.subcategory = "";
        newData.productType = "";
        newData.attributes = {};
      }
      if (name === "subcategory") {
        newData.productType = "";
        newData.attributes = {};
      }
      return newData;
    });
  };

  const handleAttributeChange = (attrName, value) => {
    setFormData((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [attrName]: value
      }
    }));
  };

  // ==================================================
  // MEDIA UPLOAD SYSTEM
  // ==================================================
  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Limits
    if (images.length + videos.length + files.length > 10) {
      return alert("Maximum 10 media files allowed.");
    }
    
    files.forEach((file) => {
      const isVideo = file.type.startsWith("video/");
      
      // Size Validation (Images: 5MB, Videos: 50MB)
      const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
      if (file.size > maxSize) {
         return alert(`${file.name} is too large (Max ${isVideo ? '50MB' : '5MB'}).`);
      }

      if (isVideo) setVideos((prev) => [...prev, file]);
      else setImages((prev) => [...prev, file]);

      const url = URL.createObjectURL(file);
      setMediaPreviews((prev) => [...prev, { url, type: isVideo ? "video" : "image", file, name: file.name }]);
    });
  };

  const removeMedia = (indexToRemove) => {
    const mediaToRemove = mediaPreviews[indexToRemove];
    if (mediaToRemove.type === "video") {
      setVideos((prev) => prev.filter(f => f !== mediaToRemove.file));
    } else {
      setImages((prev) => prev.filter(f => f !== mediaToRemove.file));
    }
    setMediaPreviews((prev) => prev.filter((_, i) => i !== indexToRemove));
    URL.revokeObjectURL(mediaToRemove.url);
  };

  // ==================================================
  // API SUBMISSION
  // ==================================================
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const finalSKU = generateSKU();
      const payload = new FormData();
      
      payload.append("title", formData.title);
      payload.append("category", formData.category);
      payload.append("subcategory", formData.subcategory);
      if (formData.productType) payload.append("productType", formData.productType);
      payload.append("price", formData.price);
      if (formData.originalPrice) payload.append("originalPrice", formData.originalPrice);
      payload.append("stock", formData.stock);
      payload.append("sku", finalSKU);
      payload.append("description", formData.description);
      
      // Store dynamic attributes as a stringified JSON object
      payload.append("attributes", JSON.stringify(formData.attributes));
      
      // Append all images and videos to the 'images' array key
      images.forEach(img => payload.append("images", img));
      videos.forEach(vid => payload.append("images", vid));

      await axios.post("http://localhost:5000/api/products/add", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Enterprise Product successfully published! 🎉");
      navigate("/products");
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.error || error.message || "Unknown error occurred";
      alert(`Failed to add product: ${errMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: "Category", icon: "📑" },
    { num: 2, label: "Details", icon: "📝" },
    { num: 3, label: "Media", icon: "🖼️" },
    { num: 4, label: "Review", icon: "✅" },
  ];

  const currentMainCat = CATEGORY_TREE.find(c => c.name === formData.category);
  const currentSubCat = currentMainCat?.subcategories.find(s => s.name === formData.subcategory);

  return (
    <div className="max-w-5xl mx-auto pb-12 font-sans h-full overflow-y-auto px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pt-4">
        <button onClick={() => navigate("/products")} className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors">
          ←
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Add New Product</h1>
          <p className="text-slate-500 font-medium text-sm">Enterprise Product Creation Engine</p>
        </div>
      </div>

      {/* Stepper Progress UI */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8 flex justify-between relative overflow-hidden">
        <div className="absolute top-1/2 left-[12%] right-[12%] h-1 bg-slate-100 -translate-y-1/2 rounded-full">
          <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }} />
        </div>
        {steps.map((s) => (
          <div key={s.num} className="flex flex-col items-center bg-white px-6 z-10">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-300 ${step >= s.num ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-110" : "bg-slate-50 text-slate-400 border border-slate-200"}`}>
              {step > s.num ? "✓" : s.icon}
            </div>
            <span className={`text-xs font-black uppercase tracking-wider mt-3 transition-colors ${step >= s.num ? "text-blue-700" : "text-slate-400"}`}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 min-h-[500px]">
        <AnimatePresence mode="wait">
          
          {/* ================= STEP 1: CATEGORY SELECTION ================= */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xl font-black text-slate-800 mb-6">1. Classification Hierarchy</h2>
              <div className="grid md:grid-cols-3 gap-6">
                
                {/* Level 1: Main */}
                <div>
                  <label className="block text-xs font-black text-slate-400 mb-3 uppercase tracking-widest">Main Category *</label>
                  <div className="space-y-3">
                    {CATEGORY_TREE.map((cat) => (
                      <div 
                        key={cat.id} 
                        onClick={() => setFormData({ ...formData, category: cat.name, subcategory: "", productType: "", attributes: {} })} 
                        className={`p-4 rounded-xl cursor-pointer border-2 font-bold transition-all ${formData.category === cat.name ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm" : "border-slate-100 hover:border-slate-300 text-slate-600"}`}
                      >
                        {cat.name}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Level 2: Subcategory */}
                <div>
                  {formData.category && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <label className="block text-xs font-black text-slate-400 mb-3 uppercase tracking-widest">Subcategory *</label>
                      <div className="space-y-3">
                        {currentMainCat?.subcategories.map(sub => (
                          <div 
                            key={sub.id} 
                            onClick={() => setFormData({ ...formData, subcategory: sub.name, productType: "", attributes: {} })} 
                            className={`p-4 rounded-xl cursor-pointer border-2 font-bold transition-all ${formData.subcategory === sub.name ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm" : "border-slate-100 hover:border-slate-300 text-slate-600"}`}
                          >
                            {sub.name}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Level 3: Product Type */}
                <div>
                  {formData.subcategory && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <label className="block text-xs font-black text-slate-400 mb-3 uppercase tracking-widest">Product Type (Optional)</label>
                      <div className="space-y-3">
                        {currentSubCat?.types.map(type => (
                          <div 
                            key={type} 
                            onClick={() => setFormData({ ...formData, productType: type })} 
                            className={`p-4 rounded-xl cursor-pointer border-2 font-bold transition-all ${formData.productType === type ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm" : "border-slate-100 hover:border-slate-300 text-slate-600"}`}
                          >
                            {type}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

              </div>
            </motion.div>
          )}

          {/* ================= STEP 2: DETAILS & DYNAMIC FIELDS ================= */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
              
              {/* Basic Info */}
              <div>
                <h2 className="text-xl font-black text-slate-800 mb-6 pb-2 border-b border-slate-100">Basic Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Product Title *</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-5 py-4 border-2 border-slate-200 bg-slate-50 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-800 text-lg" placeholder="Enter product name..." />
                  </div>
                  
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Selling Price (₹) *</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-5 py-4 border-2 border-slate-200 bg-slate-50 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition-all font-black text-emerald-600 text-lg" placeholder="0.00" />
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Original Price (₹)</label>
                    <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className="w-full px-5 py-4 border-2 border-slate-200 bg-slate-50 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-500 line-through text-lg" placeholder="0.00" />
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Inventory Stock *</label>
                    <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-5 py-4 border-2 border-slate-200 bg-slate-50 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-800" placeholder="Available quantity" />
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Custom SKU (Optional)</label>
                    <input type="text" name="sku" value={formData.sku} onChange={handleChange} className="w-full px-5 py-4 border-2 border-slate-200 bg-slate-50 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-800" placeholder="Auto-generated if left blank" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-5 py-4 border-2 border-slate-200 bg-slate-50 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-700" placeholder="Detailed product description..." />
                  </div>
                </div>
              </div>

              {/* Dynamic Attributes */}
              {activeAttributes.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-xl font-black text-slate-800 mb-6 pb-2 border-b border-slate-100 flex items-center gap-2">
                    <span className="text-indigo-500">✨</span> {formData.subcategory} Specifications
                  </h2>
                  <div className="grid md:grid-cols-3 gap-5">
                    {activeAttributes.map((attr) => (
                      <div key={attr.name}>
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">{attr.label}</label>
                        {attr.type === "select" ? (
                          <select 
                            value={formData.attributes[attr.name] || ""} 
                            onChange={(e) => handleAttributeChange(attr.name, e.target.value)} 
                            className="w-full px-4 py-3 border-2 border-slate-200 bg-slate-50 rounded-xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                          >
                            <option value="" disabled>Select {attr.label}</option>
                            {attr.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        ) : (
                          <input 
                            type="text" 
                            value={formData.attributes[attr.name] || ""} 
                            onChange={(e) => handleAttributeChange(attr.name, e.target.value)} 
                            className="w-full px-4 py-3 border-2 border-slate-200 bg-slate-50 rounded-xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-700" 
                            placeholder={`Enter ${attr.label.toLowerCase()}`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ================= STEP 3: MEDIA UPLOAD ================= */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-800">Media Assets</h2>
                  <p className="text-sm text-slate-500 font-medium mt-1">Upload high-quality images (Max 5MB) and videos (Max 50MB).</p>
                </div>
                <span className="text-xs font-black text-slate-400 bg-slate-100 px-3 py-1 rounded-lg uppercase tracking-widest">{mediaPreviews.length} / 10 Uploaded</span>
              </div>
              
              {/* Drag Drop Area */}
              <div className="relative group border-4 border-dashed border-slate-200 rounded-3xl p-14 flex flex-col items-center justify-center bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer">
                <input type="file" multiple accept="image/jpeg,image/png,image/webp,video/mp4" onChange={handleMediaUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <span className="text-6xl mb-4 transform group-hover:-translate-y-2 transition-transform duration-300">📸</span>
                <h3 className="text-xl font-black text-slate-800">Drag & Drop media here</h3>
                <p className="text-sm text-slate-500 mt-2 font-medium">Supports JPG, PNG, WEBP, MP4</p>
                <span className="mt-6 px-8 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm group-hover:border-blue-300 group-hover:text-blue-700 transition-colors">
                  Browse Files
                </span>
              </div>
              
              {/* Previews Grid */}
              {mediaPreviews.length > 0 && (
                <div className="mt-10">
                  <h4 className="text-xs font-black text-slate-400 mb-4 uppercase tracking-widest">Media Gallery</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {mediaPreviews.map((media, index) => (
                      <div key={index} className="relative group rounded-2xl overflow-hidden border border-slate-200 aspect-square bg-slate-100 shadow-sm">
                        {media.type === "image" ? (
                          <img src={media.url} alt="preview" className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <video src={media.url} className="object-cover w-full h-full" />
                        )}
                        
                        {/* Overlay Controls */}
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                          <button onClick={() => removeMedia(index)} className="w-10 h-10 bg-rose-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-rose-600 transition-colors hover:scale-110">
                            <span className="font-bold text-lg leading-none">✕</span>
                          </button>
                          <span className="text-[10px] text-white font-bold bg-slate-900/80 px-2 py-1 rounded truncate max-w-[80%]">{media.name}</span>
                        </div>

                        {/* Badges */}
                        {index === 0 && media.type === "image" && (
                          <span className="absolute top-3 left-3 px-2 py-1 bg-blue-600 text-white text-[10px] font-black rounded shadow-md uppercase tracking-wider">
                            Cover
                          </span>
                        )}
                        {media.type === "video" && (
                          <span className="absolute top-3 left-3 px-2 py-1 bg-slate-900/80 text-white text-[10px] font-black rounded shadow-md uppercase tracking-wider flex items-center gap-1">
                            <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span> Video
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ================= STEP 4: REVIEW ================= */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-xl font-black text-slate-800 mb-6">Review & Publish</h2>
              
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 flex flex-col md:flex-row gap-8 shadow-sm">
                
                {/* Cover Image */}
                <div className="w-full md:w-1/3 aspect-[4/5] rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm relative group">
                  {mediaPreviews[0]?.type === "image" ? (
                    <img src={mediaPreviews[0].url} alt="cover" className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <span className="text-4xl mb-2">📦</span>
                      <span className="text-sm font-bold">No Cover Image</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur text-slate-800 rounded-lg text-[10px] font-black uppercase shadow-sm">
                      {formData.category}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="mb-2">
                    <span className="text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-md">
                      {formData.subcategory} {formData.productType && `› ${formData.productType}`}
                    </span>
                  </div>
                  
                  <h3 className="text-3xl font-black text-slate-900 mt-2 mb-4 leading-tight">{formData.title}</h3>
                  
                  <div className="flex items-end gap-3 mb-8">
                    <span className="text-4xl font-black text-emerald-600">₹{formData.price}</span>
                    {formData.originalPrice && (
                      <span className="text-xl font-bold text-slate-400 line-through mb-1">₹{formData.originalPrice}</span>
                    )}
                    {formData.originalPrice > formData.price && (
                      <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-1 rounded ml-2 mb-2">
                        {Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-200">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Inventory</p>
                      <p className="font-bold text-slate-800 text-lg">{formData.stock} <span className="text-sm font-medium text-slate-500">Units</span></p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">SKU Code</p>
                      <p className="font-bold text-slate-800 text-lg font-mono">{generateSKU()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Media Assets</p>
                      <p className="font-bold text-slate-800 text-lg">{mediaPreviews.length} <span className="text-sm font-medium text-slate-500">Files</span></p>
                    </div>
                  </div>

                  {Object.keys(formData.attributes).length > 0 && (
                    <div className="mt-8 pt-6 border-t border-slate-200">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Technical Specs</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(formData.attributes).filter(([_, v]) => v).map(([key, value]) => (
                          <span key={key} className="bg-white border border-slate-200 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                            <span className="text-slate-400 mr-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span> {value}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center mt-8 pb-10">
        <button onClick={handlePrev} disabled={step === 1} className={`px-8 py-4 rounded-xl font-bold transition-all ${step === 1 ? "opacity-0 cursor-default" : "bg-white border border-slate-200 text-slate-600 shadow-sm hover:bg-slate-50 hover:-translate-x-1"}`}>
          ← Previous
        </button>
        
        {step < 4 ? (
          <button onClick={handleNext} className="px-10 py-4 bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:translate-x-1 transition-all flex items-center gap-2">
            Continue to Next Step →
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={isSubmitting} className="px-12 py-4 bg-emerald-500 text-white rounded-2xl font-black shadow-xl shadow-emerald-500/40 text-lg hover:bg-emerald-600 hover:-translate-y-1 transition-all flex items-center justify-center min-w-[240px] disabled:opacity-70 disabled:hover:translate-y-0">
            {isSubmitting ? (
              <span className="flex items-center gap-3">
                <span className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></span> Publishing...
              </span>
            ) : "Publish to Store 🚀"}
          </button>
        )}
      </div>

    </div>
  );
}
