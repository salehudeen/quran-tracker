/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Icon,
  ScrollView,
  Text,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { createReadingProgress } from "../graphql/mutations";
const client = generateClient();
function ArrayField({
  items = [],
  onChange,
  label,
  inputFieldRef,
  children,
  hasError,
  setFieldValue,
  currentFieldValue,
  defaultFieldValue,
  lengthLimit,
  getBadgeText,
  runValidationTasks,
  errorMessage,
}) {
  const labelElement = <Text>{label}</Text>;
  const {
    tokens: {
      components: {
        fieldmessages: { error: errorStyles },
      },
    },
  } = useTheme();
  const [selectedBadgeIndex, setSelectedBadgeIndex] = React.useState();
  const [isEditing, setIsEditing] = React.useState();
  React.useEffect(() => {
    if (isEditing) {
      inputFieldRef?.current?.focus();
    }
  }, [isEditing]);
  const removeItem = async (removeIndex) => {
    const newItems = items.filter((value, index) => index !== removeIndex);
    await onChange(newItems);
    setSelectedBadgeIndex(undefined);
  };
  const addItem = async () => {
    const { hasError } = runValidationTasks();
    if (
      currentFieldValue !== undefined &&
      currentFieldValue !== null &&
      currentFieldValue !== "" &&
      !hasError
    ) {
      const newItems = [...items];
      if (selectedBadgeIndex !== undefined) {
        newItems[selectedBadgeIndex] = currentFieldValue;
        setSelectedBadgeIndex(undefined);
      } else {
        newItems.push(currentFieldValue);
      }
      await onChange(newItems);
      setIsEditing(false);
    }
  };
  const arraySection = (
    <React.Fragment>
      {!!items?.length && (
        <ScrollView height="inherit" width="inherit" maxHeight={"7rem"}>
          {items.map((value, index) => {
            return (
              <Badge
                key={index}
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                  marginRight: 3,
                  marginTop: 3,
                  backgroundColor:
                    index === selectedBadgeIndex ? "#B8CEF9" : "",
                }}
                onClick={() => {
                  setSelectedBadgeIndex(index);
                  setFieldValue(items[index]);
                  setIsEditing(true);
                }}
              >
                {getBadgeText ? getBadgeText(value) : value.toString()}
                <Icon
                  style={{
                    cursor: "pointer",
                    paddingLeft: 3,
                    width: 20,
                    height: 20,
                  }}
                  viewBox={{ width: 20, height: 20 }}
                  paths={[
                    {
                      d: "M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z",
                      stroke: "black",
                    },
                  ]}
                  ariaLabel="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(index);
                  }}
                />
              </Badge>
            );
          })}
        </ScrollView>
      )}
      <Divider orientation="horizontal" marginTop={5} />
    </React.Fragment>
  );
  if (lengthLimit !== undefined && items.length >= lengthLimit && !isEditing) {
    return (
      <React.Fragment>
        {labelElement}
        {arraySection}
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {labelElement}
      {isEditing && children}
      {!isEditing ? (
        <>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Add item
          </Button>
          {errorMessage && hasError && (
            <Text color={errorStyles.color} fontSize={errorStyles.fontSize}>
              {errorMessage}
            </Text>
          )}
        </>
      ) : (
        <Flex justifyContent="flex-end">
          {(currentFieldValue || isEditing) && (
            <Button
              children="Cancel"
              type="button"
              size="small"
              onClick={() => {
                setFieldValue(defaultFieldValue);
                setIsEditing(false);
                setSelectedBadgeIndex(undefined);
              }}
            ></Button>
          )}
          <Button size="small" variation="link" onClick={addItem}>
            {selectedBadgeIndex !== undefined ? "Save" : "Add"}
          </Button>
        </Flex>
      )}
      {arraySection}
    </React.Fragment>
  );
}
export default function ReadingProgressCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    userId: "",
    currentSurah: "",
    currentAyah: "",
    currentJuz: "",
    completedSurahs: [],
    completedJuzs: [],
    totalAyahsRead: "",
    lastUpdated: "",
  };
  const [userId, setUserId] = React.useState(initialValues.userId);
  const [currentSurah, setCurrentSurah] = React.useState(
    initialValues.currentSurah
  );
  const [currentAyah, setCurrentAyah] = React.useState(
    initialValues.currentAyah
  );
  const [currentJuz, setCurrentJuz] = React.useState(initialValues.currentJuz);
  const [completedSurahs, setCompletedSurahs] = React.useState(
    initialValues.completedSurahs
  );
  const [completedJuzs, setCompletedJuzs] = React.useState(
    initialValues.completedJuzs
  );
  const [totalAyahsRead, setTotalAyahsRead] = React.useState(
    initialValues.totalAyahsRead
  );
  const [lastUpdated, setLastUpdated] = React.useState(
    initialValues.lastUpdated
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setUserId(initialValues.userId);
    setCurrentSurah(initialValues.currentSurah);
    setCurrentAyah(initialValues.currentAyah);
    setCurrentJuz(initialValues.currentJuz);
    setCompletedSurahs(initialValues.completedSurahs);
    setCurrentCompletedSurahsValue("");
    setCompletedJuzs(initialValues.completedJuzs);
    setCurrentCompletedJuzsValue("");
    setTotalAyahsRead(initialValues.totalAyahsRead);
    setLastUpdated(initialValues.lastUpdated);
    setErrors({});
  };
  const [currentCompletedSurahsValue, setCurrentCompletedSurahsValue] =
    React.useState("");
  const completedSurahsRef = React.createRef();
  const [currentCompletedJuzsValue, setCurrentCompletedJuzsValue] =
    React.useState("");
  const completedJuzsRef = React.createRef();
  const validations = {
    userId: [{ type: "Required" }],
    currentSurah: [{ type: "Required" }],
    currentAyah: [{ type: "Required" }],
    currentJuz: [{ type: "Required" }],
    completedSurahs: [],
    completedJuzs: [],
    totalAyahsRead: [{ type: "Required" }],
    lastUpdated: [{ type: "Required" }],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  const convertToLocal = (date) => {
    const df = new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      calendar: "iso8601",
      numberingSystem: "latn",
      hourCycle: "h23",
    });
    const parts = df.formatToParts(date).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          userId,
          currentSurah,
          currentAyah,
          currentJuz,
          completedSurahs,
          completedJuzs,
          totalAyahsRead,
          lastUpdated,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: createReadingProgress.replaceAll("__typename", ""),
            variables: {
              input: {
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "ReadingProgressCreateForm")}
      {...rest}
    >
      <TextField
        label="User id"
        isRequired={true}
        isReadOnly={false}
        value={userId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              userId: value,
              currentSurah,
              currentAyah,
              currentJuz,
              completedSurahs,
              completedJuzs,
              totalAyahsRead,
              lastUpdated,
            };
            const result = onChange(modelFields);
            value = result?.userId ?? value;
          }
          if (errors.userId?.hasError) {
            runValidationTasks("userId", value);
          }
          setUserId(value);
        }}
        onBlur={() => runValidationTasks("userId", userId)}
        errorMessage={errors.userId?.errorMessage}
        hasError={errors.userId?.hasError}
        {...getOverrideProps(overrides, "userId")}
      ></TextField>
      <TextField
        label="Current surah"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={currentSurah}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              userId,
              currentSurah: value,
              currentAyah,
              currentJuz,
              completedSurahs,
              completedJuzs,
              totalAyahsRead,
              lastUpdated,
            };
            const result = onChange(modelFields);
            value = result?.currentSurah ?? value;
          }
          if (errors.currentSurah?.hasError) {
            runValidationTasks("currentSurah", value);
          }
          setCurrentSurah(value);
        }}
        onBlur={() => runValidationTasks("currentSurah", currentSurah)}
        errorMessage={errors.currentSurah?.errorMessage}
        hasError={errors.currentSurah?.hasError}
        {...getOverrideProps(overrides, "currentSurah")}
      ></TextField>
      <TextField
        label="Current ayah"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={currentAyah}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              userId,
              currentSurah,
              currentAyah: value,
              currentJuz,
              completedSurahs,
              completedJuzs,
              totalAyahsRead,
              lastUpdated,
            };
            const result = onChange(modelFields);
            value = result?.currentAyah ?? value;
          }
          if (errors.currentAyah?.hasError) {
            runValidationTasks("currentAyah", value);
          }
          setCurrentAyah(value);
        }}
        onBlur={() => runValidationTasks("currentAyah", currentAyah)}
        errorMessage={errors.currentAyah?.errorMessage}
        hasError={errors.currentAyah?.hasError}
        {...getOverrideProps(overrides, "currentAyah")}
      ></TextField>
      <TextField
        label="Current juz"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={currentJuz}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              userId,
              currentSurah,
              currentAyah,
              currentJuz: value,
              completedSurahs,
              completedJuzs,
              totalAyahsRead,
              lastUpdated,
            };
            const result = onChange(modelFields);
            value = result?.currentJuz ?? value;
          }
          if (errors.currentJuz?.hasError) {
            runValidationTasks("currentJuz", value);
          }
          setCurrentJuz(value);
        }}
        onBlur={() => runValidationTasks("currentJuz", currentJuz)}
        errorMessage={errors.currentJuz?.errorMessage}
        hasError={errors.currentJuz?.hasError}
        {...getOverrideProps(overrides, "currentJuz")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              userId,
              currentSurah,
              currentAyah,
              currentJuz,
              completedSurahs: values,
              completedJuzs,
              totalAyahsRead,
              lastUpdated,
            };
            const result = onChange(modelFields);
            values = result?.completedSurahs ?? values;
          }
          setCompletedSurahs(values);
          setCurrentCompletedSurahsValue("");
        }}
        currentFieldValue={currentCompletedSurahsValue}
        label={"Completed surahs"}
        items={completedSurahs}
        hasError={errors?.completedSurahs?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks(
            "completedSurahs",
            currentCompletedSurahsValue
          )
        }
        errorMessage={errors?.completedSurahs?.errorMessage}
        setFieldValue={setCurrentCompletedSurahsValue}
        inputFieldRef={completedSurahsRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Completed surahs"
          isRequired={false}
          isReadOnly={false}
          type="number"
          step="any"
          value={currentCompletedSurahsValue}
          onChange={(e) => {
            let value = isNaN(parseInt(e.target.value))
              ? e.target.value
              : parseInt(e.target.value);
            if (errors.completedSurahs?.hasError) {
              runValidationTasks("completedSurahs", value);
            }
            setCurrentCompletedSurahsValue(value);
          }}
          onBlur={() =>
            runValidationTasks("completedSurahs", currentCompletedSurahsValue)
          }
          errorMessage={errors.completedSurahs?.errorMessage}
          hasError={errors.completedSurahs?.hasError}
          ref={completedSurahsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "completedSurahs")}
        ></TextField>
      </ArrayField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              userId,
              currentSurah,
              currentAyah,
              currentJuz,
              completedSurahs,
              completedJuzs: values,
              totalAyahsRead,
              lastUpdated,
            };
            const result = onChange(modelFields);
            values = result?.completedJuzs ?? values;
          }
          setCompletedJuzs(values);
          setCurrentCompletedJuzsValue("");
        }}
        currentFieldValue={currentCompletedJuzsValue}
        label={"Completed juzs"}
        items={completedJuzs}
        hasError={errors?.completedJuzs?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("completedJuzs", currentCompletedJuzsValue)
        }
        errorMessage={errors?.completedJuzs?.errorMessage}
        setFieldValue={setCurrentCompletedJuzsValue}
        inputFieldRef={completedJuzsRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Completed juzs"
          isRequired={false}
          isReadOnly={false}
          type="number"
          step="any"
          value={currentCompletedJuzsValue}
          onChange={(e) => {
            let value = isNaN(parseInt(e.target.value))
              ? e.target.value
              : parseInt(e.target.value);
            if (errors.completedJuzs?.hasError) {
              runValidationTasks("completedJuzs", value);
            }
            setCurrentCompletedJuzsValue(value);
          }}
          onBlur={() =>
            runValidationTasks("completedJuzs", currentCompletedJuzsValue)
          }
          errorMessage={errors.completedJuzs?.errorMessage}
          hasError={errors.completedJuzs?.hasError}
          ref={completedJuzsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "completedJuzs")}
        ></TextField>
      </ArrayField>
      <TextField
        label="Total ayahs read"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={totalAyahsRead}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              userId,
              currentSurah,
              currentAyah,
              currentJuz,
              completedSurahs,
              completedJuzs,
              totalAyahsRead: value,
              lastUpdated,
            };
            const result = onChange(modelFields);
            value = result?.totalAyahsRead ?? value;
          }
          if (errors.totalAyahsRead?.hasError) {
            runValidationTasks("totalAyahsRead", value);
          }
          setTotalAyahsRead(value);
        }}
        onBlur={() => runValidationTasks("totalAyahsRead", totalAyahsRead)}
        errorMessage={errors.totalAyahsRead?.errorMessage}
        hasError={errors.totalAyahsRead?.hasError}
        {...getOverrideProps(overrides, "totalAyahsRead")}
      ></TextField>
      <TextField
        label="Last updated"
        isRequired={true}
        isReadOnly={false}
        type="datetime-local"
        value={lastUpdated && convertToLocal(new Date(lastUpdated))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              userId,
              currentSurah,
              currentAyah,
              currentJuz,
              completedSurahs,
              completedJuzs,
              totalAyahsRead,
              lastUpdated: value,
            };
            const result = onChange(modelFields);
            value = result?.lastUpdated ?? value;
          }
          if (errors.lastUpdated?.hasError) {
            runValidationTasks("lastUpdated", value);
          }
          setLastUpdated(value);
        }}
        onBlur={() => runValidationTasks("lastUpdated", lastUpdated)}
        errorMessage={errors.lastUpdated?.errorMessage}
        hasError={errors.lastUpdated?.hasError}
        {...getOverrideProps(overrides, "lastUpdated")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
