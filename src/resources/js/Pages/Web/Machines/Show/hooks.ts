import { usePage } from '@inertiajs/react'

interface Category {
  id: number;
  name: string;
}

interface Series {
  id: number;
  name: string;
}

interface Creator {
  id: number;
  name: string;
}

interface MachineImage {
  id: number;
  image_url: string;
  full_image_url: string;
  caption: string | null;
}

interface Machine {
  id: number;
  name: string;
  version: string;
  description: string | null;
  category: Category;
  series: Series;
  creator: Creator;
  images: MachineImage[];
  created_at: string;
  updated_at: string;
}

export interface ShowProps {
  machine: Machine;
  [key: string]: any;
}

export function useMachinesShow() {
  const { machine } = usePage<ShowProps>().props

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP')
  }

  return {
    machine,
    formatDate
  }
}