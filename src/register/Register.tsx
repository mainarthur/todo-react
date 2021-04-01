import * as React from 'react'
import {
  useState,
  FC,
  useEffect,
  useCallback,
} from 'react'
import { useDispatch } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import MobileStepper from '@material-ui/core/MobileStepper'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import { useFormik, FormikHelpers, FormikErrors } from 'formik'
import MaskedInput from 'react-text-mask'

import useStyle from '../common/authStyles'

import ErrorSnackBar from '../common/ErrorSnackBar'

import Link from '../routing/Link'
import { history } from '../routing/routerHistory'

import { isValidEmail, isValidName, isValidPassword } from '../utils'

import { registerRequestAction } from '../redux/actions/authActions'
import { RequestStatus } from '../redux/constants'
import { createAsyncAction } from '../redux/helpers'
import ComponentProgressBar from '../common/ComponentProgressBar'

const initialValues = {
  firstName: '',
  lastName: '',
  password: '',
  email: '',
  phoneNumber: '',
}

const FORMS_COUNT = 3
const NAME_FORM = 0
const EMAIL_FORM = 1
const PASSWORD_FORM = 2

const phoneMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]

const Register: FC = () => {
  const classes = useStyle()

  const [activeStep, setActiveStep] = useState(0)

  const [requestStatus, setRequestStatus] = useState(RequestStatus.NONE)

  const dispatch = useDispatch()

  const onSnackBarClose = useCallback(() => {
    if (requestStatus === RequestStatus.ERROR) {
      setRequestStatus(RequestStatus.NONE)
    }
  }, [requestStatus])

  const handleBack = useCallback(() => {
    setActiveStep((step) => step - 1)
  }, [setActiveStep])

  const handleNext = useCallback(() => {
    setActiveStep((step) => step + 1)
  }, [setActiveStep])

  const onRegister = useCallback(
    async (values: typeof initialValues, action: FormikHelpers<typeof initialValues>) => {
      const {
        firstName,
        lastName,
        email,
        password,
      } = values

      const name = `${firstName} ${lastName}`

      try {
        alert(JSON.stringify(values, null, 4))
        return
        await createAsyncAction(dispatch, registerRequestAction({
          name,
          email,
          password,
        }))
        setRequestStatus(RequestStatus.OK)
      } catch (err) {
        setRequestStatus(RequestStatus.ERROR)
      } finally {
        action.setSubmitting(false)
      }
    },
    [dispatch, setRequestStatus],
  )

  const onSubmit = useCallback(
    (values: typeof initialValues, action: FormikHelpers<typeof initialValues>) => {
      if (activeStep !== FORMS_COUNT - 1) {
        action.setTouched({})
        action.setSubmitting(false)
        setActiveStep((step) => step + 1)
      } else {
        onRegister(values, action)
      }
    },
    [activeStep, onRegister],
  )

  const validate = useCallback((values: typeof initialValues) => {
    const {
      firstName,
      lastName,
      email,
      password,
    } = values
    const errors: FormikErrors<typeof initialValues> = {}
    switch (activeStep) {
      case NAME_FORM:
        if (firstName === '') {
          errors.firstName = 'First name is required'
        } else if (!isValidName(firstName)) {
          errors.firstName = 'Incorrect first name fromat'
        }
        if (lastName === '') {
          errors.lastName = 'Last name is required'
        } else if (!isValidName(lastName)) {
          errors.lastName = 'Incorrect last name fromat'
        }
        break
      case EMAIL_FORM:
        if (email === '') {
          errors.email = 'Email is required'
        } else if (!isValidEmail(email)) {
          errors.email = 'Incorrect email fromat'
        }
        break
      case PASSWORD_FORM:
        if (password === '') {
          errors.password = 'Password is required'
        } else if (!isValidPassword(password)) {
          errors.password = 'Password is too weak'
        }
        break
      default:
    }
    return errors
  }, [activeStep])

  const formik = useFormik({
    initialValues,
    onSubmit,
    validate,
  })

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      history.push('/')
    }
  })

  useEffect(() => {
    if (requestStatus === RequestStatus.OK) {
      history.push('/')
    }
  }, [requestStatus])

  const forms = React.useMemo(() => [
    <>
      <Grid
        item
        className={classes.gridItem}
      >
        <TextField
          variant="outlined"
          label="First Name"
          placeholder="John"
          type="text"
          id="firstName"
          name="firstName"
          className={classes.textField}
          disabled={formik.isSubmitting}
          value={formik.values.firstName}
          onChange={formik.handleChange}
          error={formik.touched.firstName && Boolean(formik.errors.firstName)}
          helperText={formik.touched.firstName && formik.errors.firstName}
        />
      </Grid>
      <Grid
        item
        className={classes.gridItem}
      >
        <TextField
          variant="outlined"
          label="Last Name"
          placeholder="Doe"
          type="text"
          id="lastName"
          name="lastName"
          className={classes.textField}
          disabled={formik.isSubmitting}
          value={formik.values.lastName}
          onChange={formik.handleChange}
          error={formik.touched.lastName && Boolean(formik.errors.lastName)}
          helperText={formik.touched.lastName && formik.errors.lastName}
        />
      </Grid>

      <Grid
        item
        className={classes.gridItem}
      >
        <MaskedInput
          guide
          keepCharPositions
          type="text"
          id="phoneNumber"
          name="phoneNumber"
          placeholderChar="_"
          disabled={formik.isSubmitting}
          value={formik.values.phoneNumber}
          onChange={formik.handleChange}
          mask={phoneMask}
          render={(ref, props) => (
            <TextField
              variant="outlined"
              label="Phone number"
              id="phoneNumber"
              name="phoneNumber"
              error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
              helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
              className={classes.textField}
              inputRef={ref}
              // eslint-disable-next-line react/prop-types
              onBlur={props.onBlur}
              // eslint-disable-next-line react/prop-types
              onChange={props.onChange}
            />
          )}
        />
      </Grid>
    </>,
    <Grid
      item
      className={classes.gridItem}
    >
      <TextField
        label="Email"
        placeholder="test@gmail.com"
        variant="outlined"
        type="email"
        id="email"
        name="email"
        className={classes.textField}
        disabled={formik.isSubmitting}
        value={formik.values.email}
        onChange={formik.handleChange}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
      />
    </Grid>,
    <Grid
      item
      className={classes.gridItem}
    >
      <TextField
        type="password"
        id="password"
        label="Password"
        name="password"
        variant="outlined"
        value={formik.values.password}
        onChange={formik.handleChange}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        disabled={formik.isSubmitting}
        className={classes.textField}
      />
    </Grid>,
  ], [
    classes.gridItem,
    classes.textField,
    formik.errors,
    formik.handleChange,
    formik.isSubmitting,
    formik.touched,
    formik.values,
  ])

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      className={classes.root}
    >
      <Grid item>
        <Paper className={classes.paper}>
          <form onSubmit={formik.handleSubmit}>
            <Grid
              container
              alignItems="center"
              direction="column"
              spacing={2}
            >
              <Grid item className={classes.gridItem}>
                <MobileStepper
                  variant="progress"
                  steps={forms.length}
                  position="static"
                  activeStep={activeStep}
                  nextButton={(
                    <Button size="small" onClick={handleNext} disabled={activeStep === forms.length - 1}>
                      Next
                      <KeyboardArrowRight />
                    </Button>
                  )}
                  backButton={(
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                      <KeyboardArrowLeft />
                      Back
                    </Button>
                  )}
                />
              </Grid>

              {forms[activeStep]}

              {forms.length === activeStep + 1 && (
                <Grid item className={classes.buttonGrid}>
                  <Button
                    className={classes.button}
                    variant="contained"
                    color="secondary"
                    type="submit"
                    disabled={formik.isSubmitting}
                  >
                    Register
                    <ComponentProgressBar
                      loading={formik.isSubmitting}
                      className={classes.progressBar}
                    />
                  </Button>
                </Grid>
              )}
              <Grid item>
                <Typography variant="body2">
                  <span>Already have an account?</span>
                  <Link disabled={formik.isSubmitting} to="/login">Login</Link>
                </Typography>
              </Grid>
            </Grid>

          </form>
        </Paper>
      </Grid>
      <ErrorSnackBar
        open={requestStatus === RequestStatus.ERROR}
        autoHide
        onClose={onSnackBarClose}
      >
        Registration Problem
      </ErrorSnackBar>
    </Grid>
  )
}

export default Register
