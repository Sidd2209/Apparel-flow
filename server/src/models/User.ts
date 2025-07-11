import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  googleId: string;
  email: string;
  username: string;
  department: 'DESIGN' | 'SOURCING' | 'PRODUCTION' | 'SALES' | 'INVENTORY';
  preferredHomepage: string;
}

const UserSchema: Schema = new Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  department: {
    type: String,
    required: true,
    enum: ['DESIGN', 'SOURCING', 'PRODUCTION', 'SALES', 'INVENTORY'],
  },
  preferredHomepage: { type: String, required: true },
}, { timestamps: true });

// Middleware to set the preferred homepage based on the selected department
UserSchema.pre<IUser>('save', function(next) {
  if (this.isModified('department')) {
    switch (this.department) {
      case 'DESIGN':
        this.preferredHomepage = '/product-development';
        break;
      case 'SOURCING':
        this.preferredHomepage = '/sourcing';
        break;
      case 'PRODUCTION':
        this.preferredHomepage = '/production-scheduler';
        break;
      case 'SALES':
        this.preferredHomepage = '/orders';
        break;
      case 'INVENTORY':
        this.preferredHomepage = '/inventory';
        break;
      default:
        this.preferredHomepage = '/';
    }
  }
  next();
});

export const User = mongoose.model<IUser>('User', UserSchema);
