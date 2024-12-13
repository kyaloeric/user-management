import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { Role, UserInput } from '../../types/user';

interface UserFormProps {
  onSubmit: (data: UserInput) => void;
  roles: Role[];
  initialData?: UserInput;
  isLoading?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  onSubmit,
  roles,
  initialData,
  isLoading,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInput>({
    defaultValues: initialData || {
      name: '',
      email: '',
      roleId: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="name"
        control={control}
        rules={{ required: 'Name is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Name"
            fullWidth
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
          },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Email"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        )}
      />

      <Controller
        name="roleId"
        control={control}
        rules={{ required: 'Role is required' }}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.roleId}>
            <InputLabel>Role</InputLabel>
            <Select {...field} label="Role">
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <Box className="flex justify-end">
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </Box>
    </form>
  );
};