import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Plus } from 'lucide-react';
import { UserTable } from '../UserTable/UserTable';
import { UserForm } from '../UserForm/UserForm';
import { User, UserInput } from '../../types/user';
import { useUsers, useRoles, useCreateUser, useUpdateUser, useDeleteUser } from '../../hooks/useUsers';

export const UserManagement: React.FC = () => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: usersData, isLoading: isLoadingUsers } = useUsers({
    page,
    limit,
    search,
  });

  const { data: roles = [] } = useRoles();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const handleCreateUser = (data: UserInput) => {
    createUser.mutate(data, {
      onSuccess: () => {
        setIsFormOpen(false);
      },
    });
  };

  const handleUpdateUser = (data: UserInput) => {
    if (selectedUser) {
      updateUser.mutate(
        { id: selectedUser.id, ...data },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            setSelectedUser(null);
          },
        }
      );
    }
  };

  const handleDeleteUser = (user: User) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser.mutate(user.id);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Plus className="h-4 w-4" />}
          onClick={() => {
            setSelectedUser(null);
            setIsFormOpen(true);
          }}
        >
          Add User
        </Button>
      </div>

      <Paper className="p-4 mb-6">
        <TextField
          fullWidth
          label="Search users"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Paper>

      <UserTable
        users={usersData?.items || []}
        total={usersData?.total || 0}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
      />

      <Dialog
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedUser(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedUser ? 'Edit User' : 'Create New User'}
        </DialogTitle>
        <DialogContent>
          <UserForm
            onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
            roles={roles}
            initialData={
              selectedUser
                ? {
                    name: selectedUser.name,
                    email: selectedUser.email,
                    roleId: selectedUser.role.id,
                  }
                : undefined
            }
            isLoading={createUser.isPending || updateUser.isPending}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};