/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type ProgressHistoryCreateFormInputValues = {
    userId?: string;
    date?: string;
    surahsRead?: number[];
    ayahsRead?: number;
    juzCompleted?: boolean;
};
export declare type ProgressHistoryCreateFormValidationValues = {
    userId?: ValidationFunction<string>;
    date?: ValidationFunction<string>;
    surahsRead?: ValidationFunction<number>;
    ayahsRead?: ValidationFunction<number>;
    juzCompleted?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ProgressHistoryCreateFormOverridesProps = {
    ProgressHistoryCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    userId?: PrimitiveOverrideProps<TextFieldProps>;
    date?: PrimitiveOverrideProps<TextFieldProps>;
    surahsRead?: PrimitiveOverrideProps<TextFieldProps>;
    ayahsRead?: PrimitiveOverrideProps<TextFieldProps>;
    juzCompleted?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type ProgressHistoryCreateFormProps = React.PropsWithChildren<{
    overrides?: ProgressHistoryCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ProgressHistoryCreateFormInputValues) => ProgressHistoryCreateFormInputValues;
    onSuccess?: (fields: ProgressHistoryCreateFormInputValues) => void;
    onError?: (fields: ProgressHistoryCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ProgressHistoryCreateFormInputValues) => ProgressHistoryCreateFormInputValues;
    onValidate?: ProgressHistoryCreateFormValidationValues;
} & React.CSSProperties>;
export default function ProgressHistoryCreateForm(props: ProgressHistoryCreateFormProps): React.ReactElement;
