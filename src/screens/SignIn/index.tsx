import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
    Platform,
    StatusBar,
    ScrollView,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Alert
} from 'react-native';
import { useTheme } from 'styled-components';
import * as Yup from 'yup';

import { RootStackParamList } from '../../@types/navigation';
import { useAuth } from '../../hooks/auth';

import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { PasswordInput } from '../../components/PasswordInput';

import {
    Container,
    Header,
    Title,
    Subtitle,
    Form,
    Footer
} from './styles';

type SignInProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

export function SignIn({ navigation }: SignInProps) {
    const theme = useTheme();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { signIn } = useAuth();

    async function handleSignIn() {
        try {
            const schema = Yup.object().shape({
                email: Yup.string()
                    .required('E-mail obrigatório')
                    .email('Digite um e-mail válido'),
                password: Yup.string()
                    .required('A senha é obrigatória')
            });

            await schema.validate({ email, password });

            signIn({ email, password });
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                Alert.alert('Opa', error.message);
            } else {
                Alert.alert(
                    'Erro na autenticação',
                    'Ocoreu um erro ao fazer login, verifique as credenciais'
                );
            }
        }

    }

    function handleNewAccount() {
        navigation.navigate('SignUpFirstStep');
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Container>
                        <StatusBar
                            barStyle="dark-content"
                            backgroundColor="transparent"
                            translucent
                        />

                        <Header>
                            <Title>
                                Estamos{'\n'}quase lá.
                            </Title>

                            <Subtitle>
                                Faça seu login para começar{'\n'}
                                uma experiência incrível
                            </Subtitle>
                        </Header>

                        <Form>
                            <Input
                                iconName="mail"
                                placeholder="E-mail"
                                keyboardType="email-address"
                                autoCorrect={false}
                                autoCapitalize="none"
                                onChangeText={setEmail}
                                value={email}
                            />

                            <PasswordInput
                                iconName="lock"
                                placeholder="Senha"
                                onChangeText={setPassword}
                                value={password}
                            />
                        </Form>

                        <Footer>
                            <Button
                                title="Login"
                                onPress={handleSignIn}
                                enabled={email !== '' && password !== ''}
                                loading={false}
                            />

                            <Button
                                title="Criar conta gratuita"
                                color={theme.colors.background_secondary}
                                light
                                onPress={handleNewAccount}
                                enabled={true}
                                loading={false}
                            />
                        </Footer>

                    </Container>
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}