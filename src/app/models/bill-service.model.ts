export interface BillServiceItem {
  id?: number;
  name: string;
  email?: string;
  serviceName: string;
  cost?: number;
  dueDate?: string;
  type?: string;
  status?: string;
  idempotencyKey?: string;
  frequency?: string;
}