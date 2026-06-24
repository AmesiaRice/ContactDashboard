export interface Contact {
  timestamp: string;
  name: string;
  phone: string;
  company: string;
  address: string;
  vehicle: string;
  city: string;
  pincode: string;
  contactType: string;
  remarks: string;
}

export interface SheetResponse {
  status: "success" | "error";
  data: Contact[];
  message?: string;
}
