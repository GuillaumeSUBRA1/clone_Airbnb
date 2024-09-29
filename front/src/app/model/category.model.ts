import { IconName } from "@fortawesome/free-regular-svg-icons";

export enum CategoryName {
    ALL = "ALL", 
    AMAZING_VIEWS = "AMAZING_VIEWS", 
    OMG = "OMG", 
    TREEHOUSES = "TREEHOUSES", 
    BEACH = "BEACH", 
    FARMS = "FARMS", 
    TINY_HOMES = "TINY_HOMES", 
    LAKE = "LAKE", 
    CONTAINERS = "CONTAINERS", 
    CAMPING = "CAMPING", 
    CASTLE = "CASTLE", 
    SKIING = "SKIING", 
    CAMPERS = "CAMPERS", 
    ARTIC = "ARTIC", 
    BOAT = "BOAT", 
    BED_AND_BREAKFASTS = "BED_AND_BREAKFASTS", 
    ROOMS = "ROOMS", 
    EARTH_HOMES = "EARTH_HOMES", 
    TOWER = "TOWER", 
    CAVES = "CAVES", 
    LUXES = "LUXES", 
    CHEFS_KITCHEN = "CHEFS_KITCHEN"
}

export interface Category {
    icon: IconName,
    name: string,
    category: CategoryName,
    active: boolean
}

export const categories: Category[] = [
    {
        icon: "infinity",
        name: "All",
        category: CategoryName.ALL,
        active: false
    },
    {
        icon: "eye",
        name: "Amazing views",
        category: CategoryName.AMAZING_VIEWS,
        active: false
    },
    {
        icon: "exclamation",
        name: "OMG!",
        category: CategoryName.OMG,
        active: false
    },
    {
        icon: "tree",
        name: "Treehouses",
        category: CategoryName.TREEHOUSES,
        active: false
    },
    {
        icon: "umbrella-beach",
        name: "Beach",
        category: CategoryName.BEACH,
        active: false
    },
    {
        icon: "tractor",
        name: "Farms",
        category: CategoryName.FARMS,
        active: false
    },
    {
        icon: "house",
        name: "Tiny homes",
        category: CategoryName.TINY_HOMES,
        active: false
    },
    {
        icon: "water",
        name: "Lake",
        category: CategoryName.LAKE,
        active: false
    },
    {
        icon: "box",
        name: "Containers",
        category: CategoryName.CONTAINERS,
        active: false
    },
    {
        icon: "tent",
        name: "Camping",
        category: CategoryName.CAMPING,
        active: false
    },
    {
        icon: "chess-rook",
        name: "Castle",
        category: CategoryName.CASTLE,
        active: false
    },
    {
        icon: "person-skiing",
        name: "Skiing",
        category: CategoryName.SKIING,
        active: false
    },
    {
        icon: "fire",
        name: "Campers",
        category: CategoryName.CAMPERS,
        active: false
    },
    {
        icon: "snowflake",
        name: "Artic",
        category: CategoryName.ARTIC,
        active: false
    },
    {
        icon: "sailboat",
        name: "Boat",
        category: CategoryName.BOAT,
        active: false
    },
    {
        icon: "mug-saucer",
        name: "Bed & breakfasts",
        category: CategoryName.BED_AND_BREAKFASTS,
        active: false
    },
    {
        icon: "lightbulb",
        name: "Rooms",
        category: CategoryName.ROOMS,
        active: false
    },
    {
        icon: "earth-europe",
        name: "Earth homes",
        category: CategoryName.EARTH_HOMES,
        active: false
    },
    {
        icon: "tower-observation",
        name: "Tower",
        category: CategoryName.TOWER,
        active: false
    },
    {
        icon: "hill-rockslide",
        name: "Caves",
        category: CategoryName.CAVES,
        active: false
    },
    {
        icon: "champagne-glasses",
        name: "Luxes",
        category: CategoryName.LUXES,
        active: false
    },
    {
        icon: "kitchen-set",
        name: "Chef's kitchen",
        category: CategoryName.CHEFS_KITCHEN,
        active: false
    }
];