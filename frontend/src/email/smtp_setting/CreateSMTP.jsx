import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCreateServerMutation } from '@/slice/smtpSlice/smtp';

const CreateSMTP = () => {
  const navigate = useNavigate();
  const [createServer, { isLoading: isCreating, error: createError }] = useCreateServerMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // Call the mutation with form data
      await createServer(data).unwrap();
      navigate('/smtp-table'); // Redirect after successful creation
    } catch (err) {
      console.error('Failed to create server:', err);
    }
  };

  return (
    <div className="p-4 w-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create SMTP Server</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Host */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="host">
            Host
          </label>
          <input
            type="text"
            id="host"
            {...register('host', { required: 'Host is required' })}
            className={`mt-1 block w-full p-2 border rounded-md ${
              errors.host ? 'border-red-500' : ''
            }`}
          />
          {errors.host && <p className="text-red-500 text-sm">{errors.host.message}</p>}
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            {...register('name', { required: 'Name is required' })}
            className={`mt-1 block w-full p-2 border rounded-md ${
              errors.name ? 'border-red-500' : ''
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* SSL */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="isSSL"
            {...register('isSSL')}
            className="mr-2"
          />
          <label className="text-sm font-medium text-gray-700" htmlFor="isSSL">
            Use SSL
          </label>
        </div>

        {/* Default */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="isDefault"
            {...register('isDefault')}
            className="mr-2"
          />
          <label className="text-sm font-medium text-gray-700" htmlFor="isDefault">
            Set as Default
          </label>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            {...register('password', { required: 'Password is required' })}
            className={`mt-1 block w-full p-2 border rounded-md ${
              errors.password ? 'border-red-500' : ''
            }`}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        {/* Submit Button */}
        <div className="flex justify-between items-center">
          <Button
            variant="primary"
            type="submit"
            disabled={isCreating}
            className="w-full"
          >
            {isCreating ? 'Creating...' : 'Create SMTP Server'}
          </Button>
        </div>
      </form>

      {/* Error Display */}
      {createError && (
        <div className="mt-4 text-red-500">
          <p>Error creating the server: {createError.message}</p>
        </div>
      )}
    </div>
  );
};

export default CreateSMTP;
