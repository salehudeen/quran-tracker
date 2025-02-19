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
export declare type ReadingProgressUpdateFormInputValues = {
    userId?: string;
    currentSurah?: number;
    currentAyah?: number;
    currentJuz?: number;
    completedSurahs?: number[];
    completedJuzs?: number[];
    totalAyahsRead?: number;
    lastUpdated?: string;
};
export declare type ReadingProgressUpdateFormValidationValues = {
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
export declare type ReadingProgressUpdateFormOverridesProps = {
    ReadingProgressUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    userId?: PrimitiveOverrideProps<TextFieldProps>;
    currentSurah?: PrimitiveOverrideProps<TextFieldProps>;
    currentAyah?: PrimitiveOverrideProps<TextFieldProps>;
    currentJuz?: PrimitiveOverrideProps<TextFieldProps>;
    completedSurahs?: PrimitiveOverrideProps<TextFieldProps>;
    completedJuzs?: PrimitiveOverrideProps<TextFieldProps>;
    totalAyahsRead?: PrimitiveOverrideProps<TextFieldProps>;
    lastUpdated?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ReadingProgressUpdateFormProps = React.PropsWithChildren<{
    overrides?: ReadingProgressUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    readingProgress?: any;
    onSubmit?: (fields: ReadingProgressUpdateFormInputValues) => ReadingProgressUpdateFormInputValues;
    onSuccess?: (fields: ReadingProgressUpdateFormInputValues) => void;
    onError?: (fields: ReadingProgressUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ReadingProgressUpdateFormInputValues) => ReadingProgressUpdateFormInputValues;
    onValidate?: ReadingProgressUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ReadingProgressUpdateForm(props: ReadingProgressUpdateFormProps): React.ReactElement;
