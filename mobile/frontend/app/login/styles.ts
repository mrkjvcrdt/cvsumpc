import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme'; // optional if you have a color theme

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors?.light?.background || '#f5f5f5', // fallback color
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors?.light?.text || '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: Colors?.light?.tint || '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
