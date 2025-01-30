export type Behavior = {
    behavior_id: string;
    name: string;
    title?: string | null;
    point_value: number;
    description?: string | null;
    icon?: string | null;
    color?: string;
    class_id?: string;
    user_id: string;
    created_date: string;
    updated_date: string;
    achievements?: Achievement[];
  }
  
  // New RewardItem type
export type RewardItem = {
    item_id: string;
    price: number;
    name: string;
    title?: string | null;
    description?: string | null;
    icon?: string | null;
    class_id?: string;
    user_id: string;
    type: "solo" | "group" | "class";
    achievements?: Achievement[];
    created_date?: string;
    updated_date?: string;
  };

  export type Achievement = {
    id: string;
    behavior_id: string | null;
    reward_item_id: string | null;
    class_id: string;
    user_id: string;
    threshold: number;
    name: string;
    created_date: string;
    updated_date: string;
};
