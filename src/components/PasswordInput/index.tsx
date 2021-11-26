import React, { useState } from 'react';
import { TextInputProps } from 'react-native';
import { useTheme } from 'styled-components';
import { Feather } from '@expo/vector-icons';
import { BorderlessButton } from 'react-native-gesture-handler';

import {
    Container,
    InputWrapper,
    IconContainer,
    InputText,
    Line
} from './styles';

interface Props extends TextInputProps {
    iconName: React.ComponentProps<typeof Feather>['name'];
    value?: string;
}

export function PasswordInput({
    iconName,
    value,
    ...rest
}: Props) {
    const theme = useTheme();

    const [isPasswordVisible, setIsPasswordVisible] = useState(true);
    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    function handleInputFocus() {
        setIsFocused(true);
    }

    function handleInputBlur() {
        setIsFocused(false);
        setIsFilled(!!value);
    }

    function handlePasswordVisibilyChange() {
        setIsPasswordVisible(prevState => !prevState);
    }

    return (
        <Container>
            <InputWrapper>
                <IconContainer>
                    <Feather
                        name={iconName}
                        size={24}
                        color={(isFocused || isFilled) ? theme.colors.main : theme.colors.text_detail}
                    />
                </IconContainer>

                <InputText
                    secureTextEntry={isPasswordVisible}
                    autoCorrect={false}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    {...rest}
                />

                <BorderlessButton onPress={handlePasswordVisibilyChange}>
                    <IconContainer>
                        <Feather
                            name={isPasswordVisible ? "eye" : "eye-off"}
                            size={24}
                            color={theme.colors.text_detail}
                        />
                    </IconContainer>
                </BorderlessButton>
            </InputWrapper>

            <Line isFocused={isFocused} />
        </Container>
    );
}