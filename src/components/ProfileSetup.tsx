import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($input: UpdateUserInput!) {
    updateUserProfile(input: $input) {
      id
      username
      department
      preferredHomepage
    }
  }
`;

const DEPARTMENTS = ['DESIGN', 'SOURCING', 'PRODUCTION', 'SALES', 'INVENTORY'];

export function ProfileSetup() {
  const [username, setUsername] = useState('');
  const [department, setDepartment] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const [updateUserProfile, { loading, error }] = useMutation(UPDATE_USER_PROFILE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !department || !user) return;

    try {
      const { data } = await updateUserProfile({
        variables: {
          input: {
            googleId: user.id, // Pass the googleId from the user context
            email: user.email, // Pass the email from the user context
            username,
            department,
          },
        },
      });

      if (data.updateUserProfile) {
        if (data.updateUserProfile.preferredHomepage) {
          navigate(data.updateUserProfile.preferredHomepage);
        } else {
          navigate('/'); // Fallback redirect
        }
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      // Handle error display to the user
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
              />
            </div>
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
              <Select onValueChange={setDepartment} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept.charAt(0).toUpperCase() + dept.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Saving...' : 'Save and Continue'}
            </Button>
            {error && <p className="text-red-500 text-sm mt-2">Error: {error.message}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
