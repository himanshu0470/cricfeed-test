export type ConfigData = {
    MarketTypeAndCategory: Market;
    configData: ConfigDataArr[]
    domain: any;
};

interface ConfigDataArr {
    configId: string;
    key: string;
    value: string;
}

interface Market {
    displayOrder: number;
    id: number;
    marketType: string;
    marketTypeCategories: MarketTypeCategory[];
}

interface MarketTypeCategory {
    id: number;
    name: string;
    description?: string; // Optional property
    marketTypeCategori: string;
    displayOrder: number;
}