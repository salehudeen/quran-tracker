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
  SwitchField,
  Text,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getProgressHistory } from "../graphql/queries";
import { updateProgressHistory } from "../graphql/mutations";
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
export default function ProgressHistoryUpdateForm(props) {
  const {
    id: idProp,
    progressHistory: progressHistoryModelProp,
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
    date: "",
    surahsRead: [],
    ayahsRead: "",
    juzCompleted: false,
  };
  const [userId, setUserId] = React.useState(initialValues.userId);
  const [date, setDate] = React.useState(initialValues.date);
  const [surahsRead, setSurahsRead] = React.useState(initialValues.surahsRead);
  const [ayahsRead, setAyahsRead] = React.useState(initialValues.ayahsRead);
  const [juzCompleted, setJuzCompleted] = React.useState(
    initialValues.juzCompleted
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = progressHistoryRecord
      ? { ...initialValues, ...progressHistoryRecord }
      : initialValues;
    setUserId(cleanValues.userId);
    setDate(cleanValues.date);
    setSurahsRead(cleanValues.surahsRead ?? []);
    setCurrentSurahsReadValue("");
    setAyahsRead(cleanValues.ayahsRead);
    setJuzCompleted(cleanValues.juzCompleted);
    setErrors({});
  };
  const [progressHistoryRecord, setProgressHistoryRecord] = React.useState(
    progressHistoryModelProp
  );
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getProgressHistory.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getProgressHistory
        : progressHistoryModelProp;
      setProgressHistoryRecord(record);
    };
    queryData();
  }, [idProp, progressHistoryModelProp]);
  React.useEffect(resetStateValues, [progressHistoryRecord]);
  const [currentSurahsReadValue, setCurrentSurahsReadValue] =
    React.useState("");
  const surahsReadRef = React.createRef();
  const validations = {
    userId: [{ type: "Required" }],
    date: [{ type: "Required" }],
    surahsRead: [],
    ayahsRead: [{ type: "Required" }],
    juzCompleted: [],
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
          date,
          surahsRead: surahsRead ?? null,
          ayahsRead,
          juzCompleted: juzCompleted ?? null,
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
            query: updateProgressHistory.replaceAll("__typename", ""),
            variables: {
              input: {
                id: progressHistoryRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "ProgressHistoryUpdateForm")}
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
              date,
              surahsRead,
              ayahsRead,
              juzCompleted,
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
        label="Date"
        isRequired={true}
        isReadOnly={false}
        type="datetime-local"
        value={date && convertToLocal(new Date(date))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              userId,
              date: value,
              surahsRead,
              ayahsRead,
              juzCompleted,
            };
            const result = onChange(modelFields);
            value = result?.date ?? value;
          }
          if (errors.date?.hasError) {
            runValidationTasks("date", value);
          }
          setDate(value);
        }}
        onBlur={() => runValidationTasks("date", date)}
        errorMessage={errors.date?.errorMessage}
        hasError={errors.date?.hasError}
        {...getOverrideProps(overrides, "date")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              userId,
              date,
              surahsRead: values,
              ayahsRead,
              juzCompleted,
            };
            const result = onChange(modelFields);
            values = result?.surahsRead ?? values;
          }
          setSurahsRead(values);
          setCurrentSurahsReadValue("");
        }}
        currentFieldValue={currentSurahsReadValue}
        label={"Surahs read"}
        items={surahsRead}
        hasError={errors?.surahsRead?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("surahsRead", currentSurahsReadValue)
        }
        errorMessage={errors?.surahsRead?.errorMessage}
        setFieldValue={setCurrentSurahsReadValue}
        inputFieldRef={surahsReadRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Surahs read"
          isRequired={false}
          isReadOnly={false}
          type="number"
          step="any"
          value={currentSurahsReadValue}
          onChange={(e) => {
            let value = isNaN(parseInt(e.target.value))
              ? e.target.value
              : parseInt(e.target.value);
            if (errors.surahsRead?.hasError) {
              runValidationTasks("surahsRead", value);
            }
            setCurrentSurahsReadValue(value);
          }}
          onBlur={() =>
            runValidationTasks("surahsRead", currentSurahsReadValue)
          }
          errorMessage={errors.surahsRead?.errorMessage}
          hasError={errors.surahsRead?.hasError}
          ref={surahsReadRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "surahsRead")}
        ></TextField>
      </ArrayField>
      <TextField
        label="Ayahs read"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={ayahsRead}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              userId,
              date,
              surahsRead,
              ayahsRead: value,
              juzCompleted,
            };
            const result = onChange(modelFields);
            value = result?.ayahsRead ?? value;
          }
          if (errors.ayahsRead?.hasError) {
            runValidationTasks("ayahsRead", value);
          }
          setAyahsRead(value);
        }}
        onBlur={() => runValidationTasks("ayahsRead", ayahsRead)}
        errorMessage={errors.ayahsRead?.errorMessage}
        hasError={errors.ayahsRead?.hasError}
        {...getOverrideProps(overrides, "ayahsRead")}
      ></TextField>
      <SwitchField
        label="Juz completed"
        defaultChecked={false}
        isDisabled={false}
        isChecked={juzCompleted}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              userId,
              date,
              surahsRead,
              ayahsRead,
              juzCompleted: value,
            };
            const result = onChange(modelFields);
            value = result?.juzCompleted ?? value;
          }
          if (errors.juzCompleted?.hasError) {
            runValidationTasks("juzCompleted", value);
          }
          setJuzCompleted(value);
        }}
        onBlur={() => runValidationTasks("juzCompleted", juzCompleted)}
        errorMessage={errors.juzCompleted?.errorMessage}
        hasError={errors.juzCompleted?.hasError}
        {...getOverrideProps(overrides, "juzCompleted")}
      ></SwitchField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || progressHistoryModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || progressHistoryModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
