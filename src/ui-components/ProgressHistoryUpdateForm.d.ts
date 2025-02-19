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
export declare type ProgressHistoryUpdateFormInputValues = {
    userId?: string;
    date?: string;
    surahsRead?: number[];
    ayahsRead?: number;
    juzCompleted?: boolean;
};
export declare type ProgressHistoryUpdateFormValidationValues = {
    userId?: ValidationFunction<string>;
    date?: ValidationFunction<string>;
    surahsRead?: ValidationFunction<number>;
    ayahsRead?: ValidationFunction<number>;
    juzCompleted?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ProgressHistoryUpdateFormOverridesProps = {
    ProgressHistoryUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    userId?: PrimitiveOverrideProps<TextFieldProps>;
    date?: PrimitiveOverrideProps<TextFieldProps>;
    surahsRead?: PrimitiveOverrideProps<TextFieldProps>;
    ayahsRead?: PrimitiveOverrideProps<TextFieldProps>;
    juzCompleted?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type ProgressHistoryUpdateFormProps = React.PropsWithChildren<{
    overrides?: ProgressHistoryUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    progressHistory?: any;
    onSubmit?: (fields: ProgressHistoryUpdateFormInputValues) => ProgressHistoryUpdateFormInputValues;
    onSuccess?: (fields: ProgressHistoryUpdateFormInputValues) => void;
    onError?: (fields: ProgressHistoryUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ProgressHistoryUpdateFormInputValues) => ProgressHistoryUpdateFormInputValues;
    onValidate?: ProgressHistoryUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ProgressHistoryUpdateForm(props: ProgressHistoryUpdateFormProps): React.ReactElement;
