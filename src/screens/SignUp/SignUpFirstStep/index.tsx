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
import * as Yup from 'yup';

import { RootStackParamList } from '../../../@types/navigation';

import { BackButton } from '../../../components/BackButton';
import { Bullet } from '../../../components/Bullet';
import { Input } from '../../../components/Input';
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

type SignUpFirstStepProps = NativeStackScreenProps<RootStackParamList, 'SignUpFirstStep'>;

export function SignUpFirstStep({ navigation }: SignUpFirstStepProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [driverLicense, setDriverLicense] = useState('');

    function handleBack() {
        navigation.goBack();
    }

    async function handleNexStep() {
        try {
            const schema = Yup.object().shape({
                driverLicense: Yup.string()
                    .required('CNH é obrigatória'),
                email: Yup.string()
                    .email('E-mail inválido')
                    .required('E-mail é obrigatório'),
                name: Yup.string()
                    .required('Nome é obrigatório'),

            });

            const data = { name, email, driverLicense };
            await schema.validate(data);

            navigation.navigate('SignUpSecondyStep', { user: data });
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                return Alert.alert('Opa', error.message)
            }
        }
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
                                <Bullet active />
                                <Bullet />
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
                            <FormTitle>1. Dados</FormTitle>
                            <Input
                                iconName="user"
                                placeholder="Nome"
                                onChangeText={setName}
                                value={name}
                            />
                            <Input
                                iconName="mail"
                                placeholder="E-mail"
                                keyboardType="email-address"
                                autoCorrect={false}
                                autoCapitalize="none"
                                onChangeText={setEmail}
                                value={email}
                            />
                            <Input
                                iconName="credit-card"
                                placeholder="CNH"
                                keyboardType="numeric"
                                onChangeText={setDriverLicense}
                                value={driverLicense}
                            />
                        </Form>

                        <Button
                            title="Próximo"
                            onPress={handleNexStep}
                        />
                    </Container>
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}