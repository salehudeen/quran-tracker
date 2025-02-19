/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type ReadingProgressCreateFormInputValues = {
    userId?: string;
    currentSurah?: number;
    currentAyah?: number;
    currentJuz?: number;
    completedSurahs?: number[];
    completedJuzs?: number[];
    totalAyahsRead?: number;
    lastUpdated?: string;
};
export declare type ReadingProgressCreateFormValidationValues = {
    userId?: ValidationFunction<string>;
    currentSurah?: ValidationFunction<number>;
    currentAyah?: ValidationFunction<number>;
    currentJuz?: ValidationFunction<number>;
    completedSurahs?: ValidationFunction<number>;
    completedJuzs?: ValidationFunction<number>;
    totalAyahsRead?: ValidationFunction<number>;
    lastUpdated?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ReadingProgressCreateFormOverridesProps = {
    ReadingProgressCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    userId?: PrimitiveOverrideProps<TextFieldProps>;
    currentSurah?: PrimitiveOverrideProps<TextFieldProps>;
    currentAyah?: PrimitiveOverrideProps<TextFieldProps>;
    currentJuz?: PrimitiveOverrideProps<TextFieldProps>;
    completedSurahs?: PrimitiveOverrideProps<TextFieldProps>;
    completedJuzs?: PrimitiveOverrideProps<TextFieldProps>;
    totalAyahsRead?: PrimitiveOverrideProps<TextFieldProps>;
    lastUpdated?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ReadingProgressCreateFormProps = React.PropsWithChildren<{
    overrides?: ReadingProgressCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ReadingProgressCreateFormInputValues) => ReadingProgressCreateFormInputValues;
    onSuccess?: (fields: ReadingProgressCreateFormInputValues) => void;
    onError?: (fields: ReadingProgressCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ReadingProgressCreateFormInputValues) => ReadingProgressCreateFormInputValues;
    onValidate?: ReadingProgressCreateFormValidationValues;
} & React.CSSProperties>;
export default function ReadingProgressCreateForm(props: ReadingProgressCreateFormProps): React.ReactElement;
