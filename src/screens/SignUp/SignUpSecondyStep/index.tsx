import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
    Platform,
    ScrollView,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Alert
} from 'react-native';
import { useTheme } from 'styled-components';

import { RootStackParamList } from '../../../@types/navigation';
import { api } from '../../../services/api';

import { BackButton } from '../../../components/BackButton';
import { Bullet } from '../../../components/Bullet';
import { PasswordInput } from '../../../components/PasswordInput';
import { Button } from '../../../components/Button';

import {
    Container,
    Header,
    Steps,
    Title,
    Subtitle,
    Form,
    FormTitle
} from './styles';

type SignUpSecondyStepProps = NativeStackScreenProps<RootStackParamList, 'SignUpSecondyStep'>;

export function SignUpSecondyStep({ navigation, route }: SignUpSecondyStepProps) {
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const theme = useTheme();

    const { user } = route.params;

    function handleBack() {
        navigation.goBack();
    }

    async function handleRegister() {
        if (!password || !passwordConfirm) {
            Alert.alert('Informe a senha e a confirmação.');
            return;
        }

        if (password != passwordConfirm) {
            Alert.alert('As senhas não são iguais');
            return;
        }

        await api.post('/users', {
            name: user.name,
            email: user.email,
            driver_license: user.driverLicense,
            password,
        })
            .then(() => {
                navigation.navigate('Confirmation', {
                    nextScreenRoute: 'SignIn',
                    title: 'Conta criada!',
                    message: 'Agora é só fazer login\ne aproveitar'
                });
            })
            .catch(() => {
                Alert.alert('Opa', 'Não foi possível cadastrar');
            });

    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Container>
                        <Header>
                            <BackButton onPress={handleBack} />
                            <Steps>
                                <Bullet />
                                <Bullet active />
                            </Steps>
                        </Header>

                        <Title>
                            Crie sua{'\n'}conta
                        </Title>

                        <Subtitle>
                            Faça seu cadastro de{'\n'}
                            forma rápida e fácil
                        </Subtitle>

                        <Form>
                            <FormTitle>2. Senha</FormTitle>

                            <PasswordInput
                                iconName="lock"
                                placeholder="Senha"
                                onChangeText={setPassword}
                                value={password}
                            />

                            <PasswordInput
                                iconName="lock"
                                placeholder="Repitir senha"
                                onChangeText={setPasswordConfirm}
                                value={passwordConfirm}
                            />

                        </Form>

                        <Button
                            color={theme.colors.success}
                            title="Cadastrar"
                            onPress={handleRegister}
                        />

                    </Container>
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}