import { useState } from 'react';
import { Button, TextInput, Card } from '@mantine/core';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      login(email, password);
      navigate('/products');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <TextInput label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button fullWidth mt="md" onClick={handleSubmit}>
        Login
      </Button>
    </Card>
  );
};

export default LoginForm;
