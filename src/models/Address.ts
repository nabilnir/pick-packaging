import mongoose, { Schema, Document } from 'mongoose';

export interface IAddress extends Document {
  userEmail: string;
  locationName: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema: Schema = new Schema({
  userEmail: { type: String, required: true, index: true },
  locationName: { type: String, default: '' },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  isPrimary: { type: Boolean, default: false }
}, {
  timestamps: true
});

const Address = mongoose.models.Address || mongoose.model<IAddress>('Address', AddressSchema);
export default Address;
