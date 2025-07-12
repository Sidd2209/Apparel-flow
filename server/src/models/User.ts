import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  googleId: string;
  email: string;
  name: string;
  department: 'DESIGN' | 'SOURCING' | 'PRODUCTION' | 'SALES' | 'INVENTORY';
  preferredHomepage: string;
}

const UserSchema: Schema = new Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: {
    type: String,
    required: false,
    enum: ['DESIGN', 'SOURCING', 'PRODUCTION', 'SALES', 'INVENTORY'],
  },
  preferredHomepage: { type: String, required: false },
}, { timestamps: true });

// Middleware to set the preferred homepage based on the selected department
UserSchema.pre<IUser>('save', function(next) {
  console.log('--- PRE-SAVE HOOK TRIGGERED ---');
  console.log('isNew:', this.isNew);
  console.log('isModified("department"):', this.isModified('department'));
  console.log('Department:', this.department);

  if (this.isNew || this.isModified('department')) {
    console.log('--- CONDITION MET, SETTING HOMEPAGE ---');
    switch (this.department) {
      case 'DESIGN':
        this.preferredHomepage = '/product-dev';
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
  console.log('--- HOMEPAGE AFTER LOGIC ---', this.preferredHomepage);
  next();
});

export const User = mongoose.model<IUser>('User', UserSchema);
